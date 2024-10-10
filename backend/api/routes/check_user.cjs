const express = require('express');
const router = express.Router();
const db = require('../db.cjs');
const jwt = require('jsonwebtoken');  // Import jsonwebtoken
const JWT_SECRET = process.env.JWT_SECRET;  // Replace with your actual JWT secret

router.post('/', (req, res) => {
    const { email } = req.body;
    
    db.query('SELECT id FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database query error', error: err });
        }

        if (results.length === 0) {
            // User not found, return exists: false
            return res.status(200).json({ exists: false });
        } else {
            // User found, return exists: true and the user ID
            const userId = results[0].id;

            // Generate JWT token with userId and a 1-day expiration time
            //const jwtToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '3d' });

            // Set the JWT token in a secure, HTTP-only cookie
            //res.cookie('auth_token', jwtToken, {
            //    httpOnly: true,     // Cookie is accessible only by the web server
            //    secure: true,       // Set to true in production (requires HTTPS)
                maxAge: 24 * 60 * 60 * 3000  // 1 day in milliseconds
           // });

            // Send response with userId and success
            return res.status(200).json({ exists: true, userId });
        }
    });
});

module.exports = router;
