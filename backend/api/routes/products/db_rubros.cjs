const express = require('express');
const router = express.Router();
const db = require('../../db.cjs');


router.post('/', ( req, res ) => {//get categories
  const {raz_social} =  req.body;
  if (!raz_social) {
    return res.status(400).send("raz_social is required");
  }

    db.query('SELECT * FROM rubro WHERE RB_cod_raz = ?', [raz_social], (err, results) => {
      if (err) {
        res.status(500).json({ message: 'Database query error', error: err })
        throw err;
      }
      if (results.length === 0) {
        return res.status(201).json({ are_there_categories: false });
      }
      const result = res.json(results)
    });
  });


module.exports = router