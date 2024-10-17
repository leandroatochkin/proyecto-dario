require('dotenv').config();
const nodemailer = require('nodemailer');
const { decrypt } = require('./utils.cjs');

const sendEmailNotification = (product, contact) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.MALBEC_EMAIL,
      pass: process.env.MALBEC_EMAIL_PASS,
    },
  });

  // Decrypt phone if it's an encrypted object
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
    text: 
    `Código producto: ${product.PD_cod_pro},
    Cantidad: ${product.quantity},
    Domicilio: ${product.address},
    Tipo de domicilio: ${product.type},
    Total a abonar: ${product.total},
    Recibe: ${product.receptor},
    Contacto: ${decryptedPhone} ${contact.email},
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('Error sending email:', error);
    }
    console.log('Email sent: ' + info.response);
  });
};

module.exports = sendEmailNotification;
