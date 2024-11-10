const express = require('express');
const router = express.Router();
const db = require('../../db.cjs');
const {ValidationError, ServerError} = require('../../../middleware/error_handling/error_models.cjs')


router.post('/', ( req, res ) => {
    const { id } = req.body;

    if (!id) {
      throw new ValidationError('ID is requires')
  }    
    db.query('SELECT EM_cod_raz_soc, EM_nom_fant, EM_delivery FROM ST_RZMA1 WHERE EM_ID_suc = ?', [id], (err, results) => {

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