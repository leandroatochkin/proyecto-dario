const express = require('express');
const router = express.Router();
const db = require('../../db.cjs');
const { ValidationError, ServerError } = require('../../../middleware/error_handling/error_models.cjs');

router.post('/', (req, res, next) => {
  // Get the city from the request body
  const { city } = req.body;

  // Check if the city is provided
  if (!city) {
    return next(new ValidationError('City is required'));
  }

  // Query to get business_ids from the businesses_locations table based on the city
  db.query('SELECT business_id FROM businesses_locations WHERE BL_city = ?', [city], (err, cityResults) => {
    if (err) {
      return next(new ServerError('Database query error', err));
    }

    // If no businesses are found in the city, return an empty response
    if (cityResults.length === 0) {
      return res.status(201).json({ message: 'No businesses found in the specified city' });
    }

    // Extract business_ids from the cityResults
    const businessIds = cityResults.map(item => item.business_id);

    // Query to get detailed business information from the ST_RZMA1 table based on the retrieved business_ids
    db.query('SELECT * FROM ST_RZMA1 WHERE EM_ID_suc IN (?)', [businessIds], (err, businessResults) => {
      if (err) {
        return next(new ServerError('Database query error', err));
      }

      // If no detailed businesses are found, return a different message
      if (businessResults.length === 0) {
        return res.status(201).json({ message: 'No businesses details found for the specified city' });
      }

      // Return the found businesses
      return res.json(businessResults);
    });
  });
});

module.exports = router;

