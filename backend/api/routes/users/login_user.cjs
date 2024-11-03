const express = require('express');
const router = express.Router();
const db = require('../../db.cjs');
const jwt = require('jsonwebtoken');  // Import jsonwebtoken
const { decrypt } = require('../../../utils.cjs');
const JWT_SECRET = process.env.JWT_SECRET;  // Replace with your actual JWT secret

router.post('/', (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).send("email is required");
    }
    
    // Query the database for the user by email
    db.query('SELECT id, password FROM users WHERE email = ? AND deleted_at IS NULL', [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database query error', error: err });
        }

        if (results.length === 0) {
            // User not found, return exists: false
            return res.status(200).json({ exists: false });
        } else {
            // User found, extract the password JSON object
            const userId = results[0].id;
            const storedPassword = results[0].password;
            const parsedPassword = JSON.parse(storedPassword);  // Parse the JSON string

            // Decrypt the stored password using the iv and encryptedData
            const decryptedPassword = decrypt(parsedPassword); // Assumes decrypt can handle the JSON structure

            // Check if the decrypted password matches the provided password
            if (decryptedPassword !== password) {
                return res.status(200).json({ exists: true, userId, valid: false });
            }

            // Passwords match, create a token
            const payload = {
                userId: userId,
                loggedIn: true
            };

            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

            // Send response with userId and success
            return res.status(200).json({ exists: true, userId, token });
        }
    });
});

module.exports = router;
