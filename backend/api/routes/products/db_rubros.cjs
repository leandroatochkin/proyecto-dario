const express = require('express');
const router = express.Router();
const db = require('../../db.cjs');


router.post('/', ( req, res ) => {//get categories
  const {raz_social} =  req.body;
  console.log(raz_social)
  if (!raz_social) {
    return res.status(400).send("raz_social is required");
  }

    db.query('SELECT * FROM rubro WHERE RB_cod_raz = ?', [raz_social], (err, results) => {
      if (err) throw err;
      const result = res.json(results)
      console.log(result)
    });
  });


module.exports = router