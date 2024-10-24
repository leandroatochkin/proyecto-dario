const { v4: uuidv4 } = require('uuid');
const express = require('express');
const router = express.Router();
const { encrypt } = require('../../../utils.cjs');
const db = require('../../db.cjs');

router.post('/', (req, res) => {
    const { email, phone, role } = req.body;

    // Check for missing fields
    if (!email || !phone) {
        return res.status(400).json({ error: 'Email and phone are required.' });
    }

    // Check if the email already exists
    db.query('SELECT EXISTS (SELECT 1 FROM users WHERE email = ?) AS email_exists', [email], (err, result) => {
        if (err) {
            console.error("Error checking for existing email:", err);
            return res.status(500).json({ error: 'Error checking for existing email' });
        }

        if (result[0].email_exists) {
            // Return 409 (Conflict) if email already exists
            return res.status(409).json({ error: 'Email already exists.' });
        }

        const id = uuidv4();

        // Encrypt the phone
        const { iv: phoneIv, encryptedData: encryptedPhone } = encrypt(phone);

        // Store both the encrypted data and IV in the database
        db.query('INSERT INTO users (id, email, phone, role) VALUES (?, ?, ?, ?)', 
            [id, email, JSON.stringify({ iv: phoneIv, encryptedData: encryptedPhone }), role || 'customer'], 
            (err, result) => {
                if (err) {
                    console.error("Error inserting user:", err);
                    return res.status(500).json({ error: 'Error inserting user' });
                }

                console.log("User inserted successfully");
                // Return success response with the new user ID
                return res.status(200).json({ success: true, userId: id });
            });

        console.log('Request body:', req.body);
    });
});

module.exports = router;
