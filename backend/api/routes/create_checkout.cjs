const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db.cjs');
const sendEmailNotification = require('../../notification_mailer.cjs');
const {getUserDetails, getProductName, getAddressType, getComission} = require('../../utils.cjs')

const orderFilePath = path.join("C:/Malbec/Archivos/Pedidos", 'GO_STCFIN1.txt'); // Update with the folder path

// Endpoint for order checkout
router.post('/checkout', async (req, res) => {
  const { orderData } = req.body;

  // Check if orderData is defined and is an array
  if (!orderData || !Array.isArray(orderData)) {
    return res.status(400).send('Invalid order data');
  }

  // Generate a unique order ID for EACH order
  const orderId = uuidv4();

  // Prepare to accumulate product details for the email
  let emailItems = "";
  let userDetails = null;

  // To accumulate the file content
  let fileContent = "";

  // Declare newOrderNumber outside the insertPromises loop
  let newOrderNumber = 0;

  // Prepare a batch insert for the database and file write with order_number
  const insertPromises = orderData.map(async (product) => {
    try {
      if (!userDetails) {
        // Fetch user details only once since they are the same for all items in the order
        userDetails = await getUserDetails(product.user_Id);
      }
      const productName = await getProductName(product.PD_cod_pro);

      // Accumulate the product details for the email
      emailItems += `Producto: ${productName}| Código: ${product.PD_cod_pro}| Cantidad: ${product.quantity}| Precio unitario: ${product.PD_pre_ven}| Total: ${product.PD_pre_ven * product.quantity}\n`;

      // Step 1: Get the current maximum order_number for this location of the business
      const query = `SELECT IFNULL(MAX(order_number), 0) AS max_order_number 
                    FROM user_orders 
                    WHERE PD_cod_raz_soc = ? AND PD_cod_suc = ?`;

      return new Promise((resolve, reject) => {
        db.query(query, [product.PD_cod_raz_soc, product.PD_cod_suc], (err, results) => {
          if (err) {
            console.error("Error fetching max order number:", err);
            return reject(err);
          }

          // Step 2: Increment the max order number by 1
          newOrderNumber = results[0].max_order_number + 1; // Store in the outer scope

          // Step 3: Insert the new order into the user_orders table with the new order_number
          const insertQuery = `INSERT INTO user_orders 
            (user_id, order_id, PD_cod_raz_soc, PD_cod_suc, PD_cod_pro, PD_pre_ven, quantity, address, type, total, state, order_number)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

          db.query(insertQuery, 
            [product.user_Id, orderId, product.PD_cod_raz_soc, product.PD_cod_suc, product.PD_cod_pro, product.PD_pre_ven, product.quantity, product.address, product.type, product.total, product.state, newOrderNumber.toString()], 
            (err, result) => {
              if (err) {
                console.error("Error inserting order:", err);
                return reject(err);
              }

              // Build the order string for each product
              const orderString = `D|${product.PD_cod_raz_soc.toString()}|${product.PD_cod_suc.toString()}|${newOrderNumber.toString().padStart(10, ' ')}|${product.PD_cod_pro.toString().padEnd(20, ' ')}|${product.PD_pre_ven.toString().padStart(16, ' ')}|${product.quantity.toString().padStart(10, ' ')}|${product.address.padEnd(50, ' ')}|${getAddressType(product.type).padEnd(20, ' ')}|${product.total.toString().padStart(16, ' ')}|${product.receptor.padEnd(20, ' ')}|${getComission(product.total, 10).toFixed(4).toString().padStart(16, ' ')}|${product.state};\n`;

              // Accumulate the file content
              fileContent += orderString;
              resolve(); // Resolve once the insertion is complete
            });
        });
      });
    } catch (error) {
      console.error('Error processing order:', error);
      throw error;
    }
  });

  try {
    await Promise.all(insertPromises);

    // Now you can use newOrderNumber here for whatever logic you want to add
    console.log('Last used newOrderNumber:', newOrderNumber); // This will log the latest value

    // Continue with the rest of the file and email logic as before
    const formattedTotal = Number(orderData[0].total).toFixed(4);
    const formattedCommission = Number(getComission(orderData[0].total, 10)).toFixed(4);

    const totalString = `T|${orderData[0].PD_cod_raz_soc.toString()}|${orderData[0].PD_cod_suc.toString()}|${newOrderNumber.toString().padStart(10, ' ')}|                    |                |          |                                                  |                    |${formattedTotal.toString().padStart(16, ' ')}|                    |${formattedCommission.toString().padStart(16, ' ')}|${orderData[0].state};\n`;

    // Append the total string to the file content
    fileContent += totalString;

    sendEmailNotification({
      items: emailItems,
      address: orderData[0].address, // Assuming same address for the entire order
      type: getAddressType(orderData[0].type),
      total: orderData[0].total,
      receptor: orderData[0].receptor // Assuming same receptor for the entire order
    }, userDetails, true);

    // Append the total to the file
    fs.appendFile(orderFilePath, fileContent, (err) => {
      if (err) {
        console.error('Failed to write order to file:', err);
        return res.status(500).send('Failed to save order');
      }

      console.log('Order saved to file successfully!');
      return res.status(200).json({ success: true, orderId });
    });
  } catch (err) {
    console.error('Error inserting some orders:', err);
    return res.status(500).json({ error: 'Error inserting some orders' });
  }
});

module.exports = router;
