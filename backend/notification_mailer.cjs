const nodemailer = require('nodemailer');
const { decrypt } = require('./utils.cjs');

const sendEmailNotification = (orderDetails, contact, business) => {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.MALBEC_EMAIL,
        pass: process.env.MALBEC_EMAIL_PASS,
      },
    });
  
    let decryptedPhone;
    try {
      decryptedPhone = decrypt(JSON.parse(contact.phone)); // Parse and decrypt
    } catch (err) {
      console.error('Error decrypting phone:', err);
      decryptedPhone = 'Unavailable'; // Fallback in case of decryption failure
    }
  
    // Only build mailOptionsToBusiness if it's a business notification
    let mailOptionsToBusiness;
    if (business) {
      if (!orderDetails) {
        console.error('Missing order details, cannot send business notification.');
        return;
      }
  
      mailOptionsToBusiness = {
        from: process.env.MALBEC_EMAIL,
        to: process.env.TEST_EMAIL,
        subject: 'Nuevo Pedido',
        text: `Productos:\n${orderDetails.items}
          Domicilio: ${orderDetails.address}
          Tipo de domicilio: ${orderDetails.type}
          Total a abonar: ${orderDetails.total}
          Recibe: ${orderDetails.receptor}
          Contacto: ${decryptedPhone} ${contact.email}`,
      };
    }
  
    const mailOptionsToClient = {
      from: process.env.MALBEC_EMAIL,
      to: contact.email,
      subject: 'Pedido Procesado',
      text: `Su pedido está siendo preparado.`,
    };
  
    // Send the appropriate email based on the business flag
    const mailOptions = business ? mailOptionsToBusiness : mailOptionsToClient;
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  };
  
  module.exports = sendEmailNotification;
  