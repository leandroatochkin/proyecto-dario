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
            const payload = {
                userId: userId,
                loggedIn: true
              };

            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });



            // Send response with userId and success
            return res.status(200).json({ exists: true, userId, token });
        }
    });
});

module.exports = router;
