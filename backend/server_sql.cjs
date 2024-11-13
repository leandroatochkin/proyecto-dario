require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const path = require('path')
const xss = require('xss-clean')
const  helmet = require('helmet')
const fs = require('fs');
const routes = require('./routes.cjs')
const centralizedErrorHandler = require('./middleware/error_handling/error_handler.cjs')



const cron = require('node-cron');
const session = require('express-session');
const {updateDiscountStatus} = require('./api/routes/businesses/client_check_discounts.cjs')

const fontendURL = process.env.FRONTEND_URL
const fontendALTURL = process.env.FRONTEND_ALT

const allowedOrigins = [
    'https://localhost:5173',
    fontendURL, // Vercel URL
    'https://localhost:4173',
    fontendALTURL
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);  // Allow requests with no origin (e.g., mobile apps)
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));




const options = {
    key: fs.readFileSync('C:/Users/leand/privkey.pem'),  // Replace with the correct path
    cert: fs.readFileSync('C:/Users/leand/cert.pem'),    // Replace with the correct path
  };
app.use(express.json());


app.use(bodyParser.json());



// Explicitly handle preflight (OPTIONS) requests
app.options(fontendURL, cors());  // Handles OPTIONS requests for all routes

// Your routes and other middleware



app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');  // Required if using credentials
    next();
});

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "default-src": ["'self'"],
            "img-src": ["'self'", "data:", "https://jqkccp38-3000.brs.devtunnels.ms"],
            "upgrade-insecure-requests": [],
        },
    },
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: false, //{ policy: 'same-origin-allow-popups' }, // Ensure same-origin policy
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

app.use(xss())

app.use(express.json()); // Parse incoming JSON data

app.use('/images', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // or '*' to allow all origins
    next();
}, express.static(path.join('C:/Malbec/IMAGENES')));





Object.entries(routes).forEach(([path, route]) => {
    app.use(path, require(route));
  });

app.use(centralizedErrorHandler)


cron.schedule('0 0 * * *', async () => {
    console.log('Running scheduled update for discount status');
    await updateDiscountStatus();
});



//https.createServer(options, app).listen(3000, ()=>{console.log('Server running on port 3000')})

app.listen(3000, ()=>{console.log('Server running on port 3000')})