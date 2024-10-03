const express = require('express');
const router = express.Router();
const db = require('../db.cjs');

router.post('/', (req, res) => {
    const { email } = req.body;
    
    db.query('SELECT id FROM users WHERE email = ?', email, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database query error', error: err });
        }

        if (results.length === 0) {
            // User not found, but return 200 with 'exists' field set to false
            return res.status(200).json({ exists: false });
        } else {
            // User found, return exists: true and the user ID
            const userId = results[0].id;
            return res.status(200).json({ exists: true, userId });
        }
    });
});

module.exports = router;
