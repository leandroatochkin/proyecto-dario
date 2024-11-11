const express = require('express');
const router = express.Router();
const db = require('../../db.cjs');
const jwt = require('jsonwebtoken');
const { decrypt } = require('../../../utils.cjs');
const JWT_SECRET = process.env.JWT_SECRET;
const {ValidationError, ServerError} = require('../../../middleware/error_handling/error_models.cjs')

router.post('/', (req, res) => {

    const { email, password } = req.body;

    if (!email) {

        throw  new ValidationError("Email is required");

    }
    
    db.query(
        'SELECT id, password, email_verified, is_google FROM users WHERE email = ? AND deleted_at IS NULL',
        [email],
        (err, results) => {
            if (err) {
                console.error('Database query error:', err);

                return next(new ServerError('Database query error', err))  

            }

            console.log('Database query successful:', results);

            if (results.length === 0) {
                console.log('User does not exist');
                return res.status(200).json({ exists: false });
            } 

            const userId = results[0].id;
            const storedPassword = results[0].password;
            const emailVerified = parseInt(results[0].email_verified, 10); 
            const isGoogle = Boolean(results[0].is_google);

            // Skip email verification if registered via Google
            if (isGoogle) {
                console.log('User registered via Google, bypassing email verification.');
                const token = jwt.sign({ userId, loggedIn: true }, JWT_SECRET, { expiresIn: '1d' });
                return res.status(200).json({ exists: true, userId, valid: true, emailVerified: true, token });
            }

            // Email verification check
            if (emailVerified === 0) {
                console.log('Email not verified');
                return res.status(200).json({ exists: true, userId, emailVerified: false });
            } 

            // Decrypt stored password and compare
            let decryptedPassword;
            try {
                const parsedPassword = JSON.parse(storedPassword);
                decryptedPassword = decrypt(parsedPassword);
            } catch (decryptionError) {
                console.error('Password decryption error:', decryptionError);
                return next(new  ServerError('Password decryption error', err)) ;

            }

            if (decryptedPassword !== password) {
                console.log('Invalid password');
                return res.status(200).json({ exists: true, userId, valid: false, emailVerified: true });
            }

            // Generate JWT if login is valid
            const token = jwt.sign({ userId, loggedIn: true }, JWT_SECRET, { expiresIn: '1d' });
            console.log('Login successful, token generated');
            return res.status(200).json({ exists: true, userId, valid: true, emailVerified: true, token });
        }
    );
});

module.exports = router;
