const express = require('express');
const router = express.Router();
const db = require('../db.cjs');


router.get('/', ( req, res ) => {//get categories
    db.query('SELECT * FROM rubro', (err, results) => {
      if (err) throw err;
      const result = res.json(results)
      console.log(result)
    });
  });


module.exports = router