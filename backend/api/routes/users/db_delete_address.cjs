const express = require('express');
const router = express.Router();
const db = require('../../db.cjs');

router.post('/', (req, res) => {
    const { userId, addressId } = req.body;

    if (!userId || !addressId) {
        return res.status(400).json({ message: 'User ID and address ID are required' });
    }

    db.query('DELETE FROM user_addresses WHERE user_id = ? AND id = ?', [userId, addressId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database deletion error', error: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Address not found or already deleted' });
        }

        return res.status(200).json({ message: 'Address deleted successfully' });
    });
});

module.exports = router;