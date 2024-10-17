require('dotenv').config();
const nodemailer = require('nodemailer');

const sendEmailNotification = (product) => {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.MALBEC_EMAIL,
        pass: process.env.MALBEC_EMAIL_PASS,
      },
    });
  
    const mailOptions = {
      from: process.env.MALBEC_EMAIL,
      to: process.env.TEST_EMAIL,
      subject: 'Nuevo Pedido',
      text: `${product.PD_cod_pro},${product.quantity},${product.address},${product.type},${product.total},${product.receptor}`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log('Error sending email:', error);
      }
      console.log('Email sent: ' + info.response);
    });
  };

  module.exports  = sendEmailNotification;