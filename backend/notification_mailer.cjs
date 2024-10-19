const nodemailer = require('nodemailer');
const { decrypt } = require('./utils.cjs');

const sendEmailNotification = (orderDetails, contact) => {
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


  const mailOptions = {
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

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('Error sending email:', error);
    }
    console.log('Email sent: ' + info.response);
  });
};

module.exports = sendEmailNotification;
