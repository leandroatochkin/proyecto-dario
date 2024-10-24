const express = require('express');
const router = express.Router();
const db = require('../../db.cjs');


router.get('/', ( req, res ) => {//get products
    db.query('SELECT * FROM ST_RZMA1', (err, results) => {
      if (err) throw err;
      const result = res.json(results)
    });
  });


module.exports = router