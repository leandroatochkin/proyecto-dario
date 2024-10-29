const express = require('express');
const router = express.Router();



router.get('/', ( req, res ) => {//get time
const data = res.json(Date.now())
  });


module.exports = router