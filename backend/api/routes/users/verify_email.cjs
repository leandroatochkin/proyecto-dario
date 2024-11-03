const express = require('express');
const router = express.Router();
const db = require('../../db.cjs');

router.post('/', (req, res) => {
    const { userId } = req.body;



    // Check if addresses array is present and contains at least one address
    if (!userId) {
        return res.status(400).json({ error: 'No id.' });
    }

    // Process each address in the array
    db.query(`UPDATE users SET email_verified = 1 WHERE id = ?`, [userId], (err, result) => {
        if (err) {
            console.error("Error verifying email:", err);
            return res.status(500).json({ error: 'Error verifying email' });
        } return res.status(200).json({ success: true });
    })



});

module.exports = router;
