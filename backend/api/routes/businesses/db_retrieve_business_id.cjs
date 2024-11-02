const express = require('express');
const router = express.Router();
const db = require('../../db.cjs');


router.post('/', ( req, res ) => {//get products
    const { id } = req.body;
    db.query('SELECT EM_cod_raz_soc, EM_nom_fant FROM ST_RZMA1 WHERE EM_ID_suc = ?', [id], (err, results) => {

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