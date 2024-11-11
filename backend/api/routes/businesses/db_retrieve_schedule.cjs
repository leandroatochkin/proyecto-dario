const express = require('express');
const router = express.Router();
const db = require('../../db.cjs');
const {ValidationError, ServerError} = require('../../../middleware/error_handling/error_models.cjs')
const error_logger  = require('../../../middleware/error_handling/error_logger.cjs')



router.post('/', ( req, res ) => {//get products


    const  { id } = req.body;

    if (!id) {
       return next( new ValidationError("branch id is required"));
      }

    db.query('SELECT EM_hora_ap,  EM_hora_cierre, EM_corte FROM ST_RZMA1 WHERE EM_ID_suc = ?',[id], (err, results) => {
      if (err) {

        return next(new  ServerError('Database query error', err));

      }
      if (results.length === 0) {
        return res.status(201).json({ are_there_businesses: false });
      }
      const result = res.json(results)
    });
  });


module.exports = router