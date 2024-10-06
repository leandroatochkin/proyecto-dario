const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');



const orderFilePath = path.join("C:/Malbec/Archivos/Pedidos", 'GO_STCFIN1.txt'); // Update with the folder path

// Endpoint for order checkout
router.post('/checkout', (req, res) => {
  const { orderData } = req.body; // Extract orderData from request body
  console.log(orderData); // Log to see if the data is coming through

  // Check if orderData is defined and is an array
  if (!orderData || !Array.isArray(orderData)) {
      return res.status(400).send('Invalid order data');
  }

  const id = uuidv4()

  // Format the order data into a string
  const orderString = orderData
      .map((product) => `${id},${product.PD_cod_raz_soc},${product.PD_cod_suc},${product.PD_cod_pro},${product.PD_pre_ven},${product.quantity},${product.address},${product.type},${product.total};`)
      .join('\n') + '\n';

  // Check if the file exists, and if not, create it and append the order
  fs.appendFile(orderFilePath, orderString, (err) => {
      if (err) {
          console.error('Failed to write order to file:', err);
          return res.status(500).send('Failed to save order');
      }

      console.log('Order saved successfully!');
      res.send('Order dispatched and saved');
  });
});
module.exports = router