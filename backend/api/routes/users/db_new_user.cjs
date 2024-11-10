const { v4: uuidv4 } = require('uuid');
const express = require('express');
const router = express.Router();
const { encrypt } = require('../../../utils.cjs');
const db = require('../../db.cjs');
const {ValidationError, ServerError, ConflictError} = require('../../../middleware/error_handling/error_models.cjs')

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
    const { email, phone, password, role, isGoogle } = req.body;
    console.log(email, phone, password, role, isGoogle)


    // Validate required fields
    if (!email || !phone || !password && !isGoogle) {

        throw new  ValidationError('Email, phone and password are required.');

    }

    // Validate email and phone formats
    if (!isValidEmail(email)) {

        throw new   ValidationError('Invalid email format.');

    }

    if (!isValidPhone(phone)) {

        throw new   ValidationError('Invalid phone format.');

    }

    if (!isValidPassword(password) && !isGoogle) {

        throw  new  ValidationError('Invalid password format.');

    }

    // Check if email already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
        if (err) {
            console.error("Error checking for existing email:", err);

            throw new  ServerError('Error checking for existing email'), err;

        }

        // Check for existing usersd
        if (result.length > 0) {
            // If the user is soft-deleted, reactivate them
            if (result[0].deleted_at !== null) {
                const id = result[0].id; // Use the existing user ID for reactivation
                const { iv: phoneIv, encryptedData: encryptedPhone } = encrypt(phone);
                const encryptedPassword = isGoogle ? null : encrypt(password);

                // Update the user record instead of inserting a new one
                db.query(
                    'UPDATE users SET phone = ?, password = ?, role = ?, is_google = ?, deleted_at = NULL WHERE id = ?',
                    [JSON.stringify({ iv: phoneIv, encryptedData: encryptedPhone }), encryptedPassword ? JSON.stringify({ iv: encryptedPassword.iv, encryptedData: encryptedPassword.encryptedData }) : null, role || 'user', isGoogle, id],
                    (err) => {
                        if (err) {
                            console.error("Error reactivating user:", err);

                            throw  new  ServerError('Error reactivating user'), err;

                        }
                        console.log("User reactivated successfully");
                        return res.status(200).json({ success: true, userId: id });
                    }
                );
                return; // Exit the function after reactivating the user
            }

            // Return conflict if email already exists for a non-deleted user
            throw new ConflictError('Email already exists')
        }

        // Proceed with user creation if email does not exist
        const id = uuidv4();
        const { iv: phoneIv, encryptedData: encryptedPhone } = encrypt(phone);
        const encryptedPassword = isGoogle ? null : encrypt(password);

        db.query(
            'INSERT INTO users (id, email, phone, role, password, is_google) VALUES (?, ?, ?, ?, ?, ?)', 
            [id, email, JSON.stringify({ iv: phoneIv, encryptedData: encryptedPhone }), role || 'user',  encryptedPassword ? JSON.stringify({ iv: encryptedPassword.iv, encryptedData: encryptedPassword.encryptedData }) : null, isGoogle], 
            (err) => {
                if (err) {
                    // Handle duplicate entry error in case of race condition
                    if (err.code === 'ER_DUP_ENTRY') {

                        throw new ConflictError('Email already exists')
                    }
                    console.error("Error inserting user:", err);

                    throw  new ServerError('Error inserting user'), err;

                }

                console.log("User inserted successfully");
                return res.status(201).json({ success: true, userId: id });
            }
        );
    });
});

module.exports = router;
