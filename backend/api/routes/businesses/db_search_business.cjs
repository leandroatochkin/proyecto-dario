const express = require('express');
const router = express.Router();
const db = require('../../db.cjs');
const { ValidationError, ServerError } = require('../../../middleware/error_handling/error_models.cjs');

router.post('/', (req, res, next) => {
  // Get the city from the request body
  const { searchValue } = req.body;

  // Check if the city is provided
  if (!searchValue) {
    return next(new ValidationError('Value is required'));
  }

  db.query('SELECT r.EM_nom_fant, r.EM_dom_suc, r.EM_ID_suc, r.EM_cod_raz_soc, c.BL_city FROM ST_rzma1 r JOIN businesses_locations c ON r.EM_ID_suc = c.business_id WHERE (r.EM_nom_fant LIKE ? OR r.EM_rubro LIKE ?) ORDER BY r.EM_nom_fant ASC LIMIT 50', [`%${searchValue}%`, `%${searchValue}%`], (err, result) => {
    if (err) {
      return next(new ServerError('Database query error', err));
    }

    // If no businesses are found in the city, return an empty response
    if (result.length === 0) {
      return res.status(201).json({ message: 'No businesses found ' });
    }


    

      // Return the found businesses
      return res.json(result);
    });
  });


module.exports = router;
