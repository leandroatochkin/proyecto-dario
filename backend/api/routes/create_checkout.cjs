const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db.cjs');

const orderFilePath = path.join("C:/Malbec/Archivos/Pedidos", 'GO_STCFIN1.txt'); // Update with the folder path

// Endpoint for order checkout
router.post('/checkout', (req, res) => {
  const { orderData } = req.body;
  
  // Check if orderData is defined and is an array
  if (!orderData || !Array.isArray(orderData)) {
      return res.status(400).send('Invalid order data');
  }

  // Generate a unique order ID for EACH order
  const orderId = uuidv4();

  // Prepare a batch insert for the database and file write with order_number
  const insertPromises = orderData.map((product) => {
    return new Promise((resolve, reject) => {

      // Step 1: Get the current maximum order_number for this location of the business
      const query = `SELECT IFNULL(MAX(order_number), 0) AS max_order_number 
                     FROM user_orders 
                     WHERE PD_cod_raz_soc = ? AND PD_cod_suc = ?`;

      db.query(query, [product.PD_cod_raz_soc, product.PD_cod_suc], (err, results) => {
        if (err) {
          console.error("Error fetching max order number:", err);
          return reject(err);
        }

        // Step 2: Increment the max order number by 1
        const newOrderNumber = results[0].max_order_number + 1;

        // Step 3: Insert the new order into the user_orders table with the new order_number
        const insertQuery = `INSERT INTO user_orders 
          (user_id, order_id, PD_cod_raz_soc, PD_cod_suc, PD_cod_pro, PD_pre_ven, quantity, address, type, total, state, order_number)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(insertQuery, 
          [product.user_Id, orderId, product.PD_cod_raz_soc, product.PD_cod_suc, product.PD_cod_pro, product.PD_pre_ven, product.quantity, product.address, product.type, product.total, product.state, newOrderNumber], 
          (err, result) => {
            if (err) {
              console.error("Error inserting order:", err);
              return reject(err);
            }

            // Step 4: Format the order data for the file with order_number
            const orderString = `D,${product.PD_cod_raz_soc.toString().padEnd(4, ' ')},${product.PD_cod_suc.toString().padEnd(4, ' ')},${product.PD_cod_pro.toString().padEnd(20, ' ')},${product.PD_pre_ven.toString().padEnd(16, ' ')},${product.quantity.toString().padEnd(10, ' ')},${product.address.padEnd(50, ' ')},${product.type},${product.total.toString().padEnd(16, ' ')},${product.state},${newOrderNumber.toString().padStart(8, ' ')};\n`;

            resolve(orderString); // Resolve with the formatted string
          });
      });
    });
  });

  // After all insertions and file formatting
  Promise.all(insertPromises)
      .then((orderStrings) => {
          // Concatenate all order strings and append to the file
          const totalString = `T,${orderData[0].total};\n`;
          const fileContent = orderStrings.join('') + totalString;

          // Append the order and total to the file
          fs.appendFile(orderFilePath, fileContent, (err) => {
              if (err) {
                  console.error('Failed to write order to file:', err);
                  return res.status(500).send('Failed to save order');
              }

              console.log('Order saved to file successfully!');
              return res.status(200).json({ success: true, orderId }); // Respond with the order ID
          });
      })
      .catch(err => {
          console.error("Error inserting some orders:", err);
          return res.status(500).json({ error: 'Error inserting some orders' });
      });
});

module.exports = router;
