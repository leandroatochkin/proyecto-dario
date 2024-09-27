require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const password =  process.env.DB_PASSWORD;



// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: password,
    database: 'restaurant_menu'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

module.exports = db;