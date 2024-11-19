const express = require('express');
const router = express.Router();
const db = require('../../db.cjs');
const {ValidationError, ServerError} = require('../../../middleware/error_handling/error_models.cjs')

router.post('/', ( req, res, next ) => {
    const { city } = req.body;

    if (!city) {
      return next(new  ValidationError('razSoc is required')) 

  }    
    db.query('SELECT business_id FROM businesses_locations WHERE BL_city = ?', [city], (err, results) => {

      if (err) {
        return next(new ServerError('Database query error', err))

      }
      if (results.length === 0) {
        return res.status(201).json({ are_there_businesses_in_area: false });
      }
      const result = res.json(results)
    });
  });


module.exports = router