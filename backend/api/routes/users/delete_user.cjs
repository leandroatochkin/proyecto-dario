const express = require('express');
const router = express.Router();
const db = require('../../db.cjs');

router.post('/', (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).send("userId is required");
    }

    const firstQuery = 'DELETE FROM user_addresses WHERE user_id = ?';
    const secondQuery = 'UPDATE users SET deleted_at = NOW(), email_verified = 0, phone = NULL, password = NULL WHERE id = ?';

    // Delete all addresses for the user
    db.query(firstQuery, [userId], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting user addresses', error: err });
        }

        // Mark user as deleted and nullify sensitive data
        db.query(secondQuery, [userId], (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error updating user information', error: err });
            }

            return res.status(200).json({ success: true });
        });
    });
});

module.exports = router;
 