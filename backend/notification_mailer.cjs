const nodemailer = require('nodemailer');

const sendEmailNotification = (product) => {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'mail.de.prueba.para.app.restaurant@gmail.com',
        pass: 'sico mbot xfbk poax',
      },
    });
  
    const mailOptions = {
      from: 'mail.de.prueba.para.app.restaurant@gmail.com',
      to: 'leandronatochkin@gmail.com',
      subject: 'Menu Updated',
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