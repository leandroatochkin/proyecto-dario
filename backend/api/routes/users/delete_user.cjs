const express = require('express');
const router = express.Router();
const db = require('../../db.cjs');

router.post('/', (req, res) => {
    const { userId } = req.body;

    const firstQuery = 'DELETE FROM user_addresses WHERE user_id = ?';
    const secondQuery = 'UPDATE users SET deleted_at = NOW() WHERE id = ?';
     // This query is

    // Delete all addresses for the user
    db.query(firstQuery, [userId], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting user addresses', error: err });
        }

              
               db.query(secondQuery,  [userId], (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error deleting user', error: err });
                }

            return res.status(200).json({ success: true });
        });
    });
});


module.exports = router;
