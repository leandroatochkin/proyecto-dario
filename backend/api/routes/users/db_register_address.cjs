const { v4: uuidv4 } = require('uuid');
const express = require('express');
const router = express.Router();
const { encrypt } = require('../../../utils.cjs');
const db = require('../../db.cjs');

router.post('/', (req, res) => {
    const { userId, addresses } = req.body;

    const isValidAddress = (address) => /^[a-zA-Z0-9\s.,#\-\/]+$/.test(address);

    // Check if addresses array is present and contains at least one address
    if (!addresses || addresses.length === 0) {
        return res.status(400).json({ error: 'At least one address is required.' });
    }

    // Process each address in the array
    const insertPromises = addresses.map(({ address, type }) => {
        // Check for missing address field
        if (!address) {
            return Promise.reject({ error: 'Address is required for all entries.' });
        }
        
        // Validate the address format
        const validAddress = isValidAddress(address);
        if (!validAddress) {
            return Promise.reject({ error: 'Invalid address format.' });
        }

        const id = uuidv4();

        // Encrypt the address
        const { iv: addressIv, encryptedData } = encrypt(address);

        // Set default type to 'home' if not provided
        const addressType = type || 'home';

        // Store both the encrypted data and IV in the database
        return new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO user_addresses (id, user_id, address, address_type) VALUES (?, ?, ?, ?)', 
                [id, userId, JSON.stringify({ iv: addressIv, encryptedData }), addressType], 
                (err, result) => {
                    if (err) {
                        console.error("Error inserting address:", err);
                        reject({ error: 'Error inserting address' });
                    } else {
                        console.log("Address inserted successfully");
                        resolve(result);
                    }
                }
            );
        });
    });

    // Wait for all insertions to complete
    Promise.all(insertPromises)
        .then(() => {
            res.status(200).json({ success: true, message: 'All addresses inserted successfully.' });
        })
        .catch((error) => {
            res.status(500).json({ error: error.error || 'Error inserting addresses.' });
        });
});

module.exports = router;
