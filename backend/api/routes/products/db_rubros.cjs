const express = require('express');
const router = express.Router();
const db = require('../../db.cjs');
const {ValidationError, ServerError} = require('../../../middleware/error_handling/error_models.cjs')


router.post('/', ( req, res ) => {//get categories
  const {raz_social} =  req.body;
  if (!raz_social) {
    throw new ValidationError('raz_social is required')
  }

    db.query('SELECT * FROM rubro WHERE RB_cod_raz = ?', [raz_social], (err, results) => {
      if (err) {

        throw new  ServerError('Database query error'), err

      }
      if (results.length === 0) {
        return res.status(201).json({ are_there_categories: false });
      }
      const result = res.json(results)
    });
  });


module.exports = router