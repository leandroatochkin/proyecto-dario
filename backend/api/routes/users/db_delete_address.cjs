const express = require('express');
const router = express.Router();
const db = require('../../db.cjs');
const {ValidationError, ServerError, NotFoundError} = require('../../../middleware/error_handling/error_models.cjs')

router.post('/', (req, res) => {
    const { userId, addressId } = req.body;

    if (!userId || !addressId) {

        return next(new  ValidationError('User ID and address ID are required')) 

    }

    db.query('DELETE FROM user_addresses WHERE user_id = ? AND id = ?', [userId, addressId], (err, result) => {
        if (err) {

            return next(new ServerError('Database deletion error', err))  

        }

        if (result.affectedRows === 0) {

            return next(new  NotFoundError('Address not found or already deleted', err));

        }

        return res.status(200).json({ message: 'Address deleted successfully' });
    });
});

module.exports = router;