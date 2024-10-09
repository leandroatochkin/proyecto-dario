const express = require('express');
const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const app = express();


// Paths to the rubro and producto text files
const rubroPath = path.join(__dirname, 'INTERFACE-RUBRO.txt');
const productoPath = path.join(__dirname, 'INTERFACE-PRODUCTO.txt');


// Route to handle rubro file upload
router.post('/upload/rubro', (req, res) => {
    const fileData = req.body.data;  // Get file data from request body
    console.log('Processing Rubro Data:', fileData);
    // Add your logic here to handle the rubro file data
    res.status(200).send('Rubro data received');
});

// Route to handle producto file upload
router.post('/upload/producto', (req, res) => {
    const fileData = req.body.data;  // Get file data from request body
    console.log('Processing Producto Data:', fileData);
    // Add your logic here to handle the producto file data
    res.status(200).send('Producto data received');
});

// Watch the files for changes
const watcher = chokidar.watch([rubroPath, productoPath], {
    persistent: true,
});

// Function to "upload" file contents to the internal express routes
const uploadFileData = (filePath) => {
    console.log(`Uploading ${filePath}...`);
    const fileData = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);

    // Simulate an internal request to the appropriate route based on the file type
    const url = fileName === 'INTERFACE-RUBRO.txt' ? '/upload/rubro' : '/upload/producto';

    // Simulate sending the file data to the internal Express route
    app.handle(
        { method: 'POST', url, body: { data: fileData }, headers: {} },
        { status: (code) => ({ send: (message) => console.log(`Response: ${message}`) }) },
        () => {} // Empty next function
    );
};

// Event listener for when a file changes
watcher.on('change', (filePath) => {
    console.log(`File ${filePath} has been updated, uploading...`);
    uploadFileData(filePath);
});

// Event listener for errors
watcher.on('error', (error) => {
    console.error('Watcher error:', error);
});

module.exports = router
