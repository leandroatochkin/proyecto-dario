const express = require('express');
const router = express.Router();
const db = require('../../db.cjs');
const jwt = require('jsonwebtoken');  // Import jsonwebtoken
const JWT_SECRET = process.env.JWT_SECRET;  // Replace with your actual JWT secret
const {ValidationError, ServerError} = require('../../../middleware/error_handling/error_models.cjs')

router.post('/', (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new  ValidationError("email is required"))
      }
    
    db.query('SELECT id FROM users WHERE email = ? AND deleted_at IS NULL', [email], (err, results) => {
        if (err) {

            return next( new  ServerError('Database query', err));

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
