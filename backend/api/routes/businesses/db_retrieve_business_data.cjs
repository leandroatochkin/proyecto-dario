const express = require('express');
const router = express.Router();
const db = require('../../db.cjs');
const { ValidationError, ServerError } = require('../../../middleware/error_handling/error_models.cjs');

router.post('/', (req, res, next) => {  // Note the `next` parameter here
  const { id } = req.body;

  if (!id || id === '') {
    return next(new ValidationError('ID is required')); // Pass error to error handler
  }    

  db.query('SELECT EM_cod_raz_soc, EM_nom_fant, EM_delivery FROM ST_RZMA1 WHERE EM_ID_suc = ?', [id], (err, results) => {
    if (err) {
      return next(new ServerError('Database query error', err)); // Pass error to error handler
    }

    if (results.length === 0) {
      return res.status(201).json({ are_there_businesses: false });
    }

    return res.json(results);
  });
});

module.exports = router;
