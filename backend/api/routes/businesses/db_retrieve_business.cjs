const express = require('express');
const router = express.Router();
const db = require('../../db.cjs');


router.get('/', ( req, res ) => {//get products
    db.query('SELECT * FROM ST_RZMA1', (err, results) => {
      if (err) {
        res.status(500).json({ message: 'Database query error', error: err })
        throw err;
      }
      if (results.length === 0) {
        return res.status(201).json({ are_there_businesses: false });
      }
      const result = res.json(results)
    });
  });


module.exports = router