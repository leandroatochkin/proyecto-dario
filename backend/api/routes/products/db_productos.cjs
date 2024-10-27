const express = require('express');
const router = express.Router();
const db = require('../../db.cjs');


router.post('/', ( req, res ) => {//get products
  const {raz_social} =  req.body;
  if (!raz_social) {
    return res.status(400).send("raz_social is required");
  }

    db.query('SELECT * FROM producto WHERE PD_cod_raz_soc = ?', [raz_social],(err, results) => {
      if (err) {
        res.status(500).json({ message: 'Database query error', error: err })
        throw err;
      }
      if (results.length === 0) {
        return res.status(201).json({ are_there_products: false });
      }
      const result = res.json(results)
    });
  });


module.exports = router