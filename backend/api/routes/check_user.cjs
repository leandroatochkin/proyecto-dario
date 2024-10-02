const express = require('express');
const router = express.Router();
const db = require('../db.cjs');


router.post('/', (req, res) => {
    const { email } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', email, (err, results) => {
      if (err) throw err;
      if (results.length === 0) {
        res.status(404).json({ message: 'User not found' });
      } else {
        res.status(200).json({ message: 'Email already exists' });
      }
    });
  });

module.exports = router