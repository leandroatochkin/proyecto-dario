const { v4: uuidv4 } = require('uuid');
const express = require('express');
const router = express.Router();
const { encrypt } = require('../../../utils.cjs');
const db = require('../../db.cjs');

// Helper function to validate email and phone
const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
const isValidPhone = (phone) => /^[0-9]+$/.test(phone);
const isValidPassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>\/?]).{8,}$/.test(password) 
//At least 8 characters long
//Contains at least one uppercase letter
//Contains at least one lowercase letter
//Contains at least one digit
//Contains at least one special character (e.g., !@#$%^&*())

router.post('/', (req, res) => {
    const { email, phone, password, role } = req.body;

    // Validate required fields
    if (!email || !phone || !password) {
        return res.status(400).json({ error: 'Email, phone and password are required.' });
    }

    // Validate email and phone formats
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }
    if (!isValidPhone(phone)) {
        return res.status(400).json({ error: 'Invalid phone format.' });
    }

    if (!isValidPassword(password)) {
        return res.status(400).json({ error: 'Invalid password format.' });
    }

    // Check if email already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
        if (err) {
            console.error("Error checking for existing email:", err);
            return res.status(500).json({ error: 'Error checking for existing email' });
        }

        // Check for existing users
        if (result.length > 0) {
            // If the user is soft-deleted, reactivate them
            if (result[0].deleted_at !== null) {
                const id = result[0].id; // Use the existing user ID for reactivation
                const { iv: phoneIv, encryptedData: encryptedPhone } = encrypt(phone);
                const { iv: passwordIv, encryptedData: encryptedPassword } = encrypt(password);

                // Update the user record instead of inserting a new one
                db.query(
                    'UPDATE users SET phone = ?, password = ?, role = ?, deleted_at = NULL WHERE id = ?',
                    [JSON.stringify({ iv: phoneIv, encryptedData: encryptedPhone }), ({iv: passwordIv, encryptedData: encryptedPassword}), role || 'customer', id],
                    (err) => {
                        if (err) {
                            console.error("Error reactivating user:", err);
                            return res.status(500).json({ error: 'Error reactivating user' });
                        }
                        console.log("User reactivated successfully");
                        return res.status(200).json({ success: true, userId: id });
                    }
                );
                return; // Exit the function after reactivating the user
            }

            // Return conflict if email already exists for a non-deleted user
            return res.status(409).json({ error: 'Email already exists.' });
        }

        // Proceed with user creation if email does not exist
        const id = uuidv4();
        const { iv: phoneIv, encryptedData: encryptedPhone } = encrypt(phone);
        const { iv: passwordIv, encryptedData: encryptedPassword } = encrypt(password);

        db.query(
            'INSERT INTO users (id, email, phone, role, password) VALUES (?, ?, ?, ?, ?)', 
            [id, email, JSON.stringify({ iv: phoneIv, encryptedData: encryptedPhone }), role || 'customer',  JSON.stringify({ iv: passwordIv, encryptedData: encryptedPassword })], 
            (err) => {
                if (err) {
                    // Handle duplicate entry error in case of race condition
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(409).json({ error: 'Email already exists.' });
                    }
                    console.error("Error inserting user:", err);
                    return res.status(500).json({ error: 'Error inserting user' });
                }

                console.log("User inserted successfully");
                return res.status(201).json({ success: true, userId: id });
            }
        );
    });
});

module.exports = router;
