require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.json()); // Parse incoming JSON data
app.use(cors());

// MongoDB Client Setup
const uri = process.env.MONGO_DB_CONNECTION;

    const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  let db;


  async function connectToMongoDB() {
    try {
      await client.connect();
      db = client.db('restaurant-db'); // Replace with your database name
      console.log("Successfully connected to MongoDB!");
    } catch (error) {
      console.error("Failed to connect to MongoDB", error);
      process.exit(1); // Exit process with a failure code
    }
  }

  connectToMongoDB();

// Endpoint to receive menu data and update the database
app.post('/upload', async (req, res) => {
  const menuData = req.body; // Array of menu items from Excel

  try {
    const collection = db.collection('menu');

    // Loop through the menu data and insert/update the database
    for (const item of menuData) {
      await collection.updateOne(
        { item_name: item.item }, // Filter by item_name
        { $set: { price: item.precio, description: item.descripcion } }, // Update price and description
        { upsert: true } // Insert a new document if one doesn't exist
      );
    }

    // Send email notification to admin
    sendEmailNotification();
    res.send('Menu updated successfully');
  } catch (err) {
    console.error('Error updating menu:', err);
    res.status(500).send('Error updating menu');
  }
});

app.get('/menu', async (req, res) => {
    try {
      const collection = db.collection('menu');
      const menuItems = await collection.find().toArray(); // Fetch all documents from the menu collection
      res.json(menuItems); // Send the result as JSON
    } catch (err) {
      console.error('Error retrieving menu:', err);
      res.status(500).send('Error retrieving menu');
    }
  });

// Email Notification Function
const sendEmailNotification = () => {
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
    text: 'The restaurant menu has been updated successfully.',
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('Error sending email:', error);
    }
    console.log('Email sent: ' + info.response);
  });
};

app.listen(3000, () => console.log('Server running on port 3000'));
