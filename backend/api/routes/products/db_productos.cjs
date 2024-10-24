const express = require('express');
const router = express.Router();
const db = require('../../db.cjs');


router.post('/', ( req, res ) => {//get products
  const {raz_social} =  req.body;
  console.log(raz_social)
  if (!raz_social) {
    return res.status(400).send("raz_social is required");
  }

    db.query('SELECT * FROM producto WHERE PD_cod_raz_soc = ?', [raz_social],(err, results) => {
      if (err) throw err;
      const result = res.json(results)
    });
  });


module.exports = router