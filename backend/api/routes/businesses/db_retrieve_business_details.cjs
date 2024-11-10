const express = require('express');
const router = express.Router();
const db = require('../../db.cjs');
const {ValidationError, ServerError} = require('../../../middleware/error_handling/error_models.cjs')

router.post('/', ( req, res ) => {
    const { razSoc } = req.body;

    if (!razSoc) {
      throw new  ValidationError('razSoc is required');

  }    
    db.query('SELECT EM_delivery FROM ST_RZMA1 WHERE EM_cod_raz_soc = ?', [razSoc], (err, results) => {

      if (err) {
        throw  new ServerError('Database query error'), err;

      }
      if (results.length === 0) {
        return res.status(201).json({ are_there_businesses: false });
      }
      const result = res.json(results)
    });
  });


module.exports = router