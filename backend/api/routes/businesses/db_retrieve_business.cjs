const express = require('express');
const router = express.Router();
const db = require('../../db.cjs');
const {ServerError} = require('../../../middleware/error_handling/error_models.cjs')


router.get('/', ( req, res ) => {//get products
    db.query('SELECT * FROM ST_RZMA1', (err, results) => {
      if (err) {
        return next(new ServerError('Database query error', err))  

      }
      if (results.length === 0) {
        return res.status(201).json({ are_there_businesses: false });
      }
      const result = res.json(results)
    });
  });


module.exports = router