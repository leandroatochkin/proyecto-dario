const express = require('express');
const router = express.Router();
const db = require('../../db.cjs');
const jwt = require('jsonwebtoken');
const { decrypt } = require('../../../utils.cjs');
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/', (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).send("Email is required");
    }
    
    db.query(
        'SELECT id, password, email_verified, is_google FROM users WHERE email = ? AND deleted_at IS NULL',
        [email],
        (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Database query error', error: err });
            }

            console.log('Database results:', results);

            if (results.length === 0) {
                return res.status(200).json({ exists: false });
            } 

            const userId = results[0].id;
            const storedPassword = results[0].password;
            const emailVerified = parseInt(results[0].email_verified, 10); 
            const isGoogle = Boolean(results[0].is_google); // Check if user registered with Google

            // If registered via Google, skip email verification check
            if (isGoogle) {
                console.log('User registered via Google; skipping email verification.');
                const token = jwt.sign({ userId, loggedIn: true }, JWT_SECRET, { expiresIn: '1d' });
                return res.status(200).json({ exists: true, userId, valid: true, emailVerified: true, token });
            }

            // If email is not verified, return with emailVerified as false
            if (emailVerified === 0) {
                console.log('Email is not verified');
                return res.status(200).json({ exists: true, userId, emailVerified: false });
            } 

            // Decrypt and compare password
            const parsedPassword = JSON.parse(storedPassword);
            const decryptedPassword = decrypt(parsedPassword);

            if (decryptedPassword !== password) {
                return res.status(200).json({ exists: true, userId, valid: false, emailVerified: true });
            }

            // Create token if password is correct and email is verified
            const token = jwt.sign({ userId, loggedIn: true }, JWT_SECRET, { expiresIn: '1d' });

            return res.status(200).json({ exists: true, userId, valid: true, emailVerified: true, token });
        }
    );
});

module.exports = router;
