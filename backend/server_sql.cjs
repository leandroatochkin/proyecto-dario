const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const path = require('path')
const xss = require('xss-clean')
const  helmet = require('helmet')
const fs = require('fs');
const routes = require('./routes.cjs')



const cron = require('node-cron');
const session = require('express-session');
const {updateDiscountStatus} = require('./api/routes/businesses/client_check_discounts.cjs')

// const allowedOrigins = [
//     'https://localhost:5173', 
//     'https://malbec2-pjl72ly8k-leandroatochkins-projects.vercel.app', 
//     'https://localhost:4173'
// ];

// // CORS setup
// app.use(cors({
//     origin: (origin, callback) => {
//         if (!origin) return callback(null, true);  // Allow requests with no origin (mobile apps, curl, etc.)
        
//         if (allowedOrigins.includes(origin)) {
//             callback(null, true);  // Allow the origin
//         } else {
//             callback(new Error('Not allowed by CORS'));  // Reject other origins
//         }
//     },
//     credentials: true,  // Allow credentials (cookies or authorization headers)
//     methods: ['GET', 'POST'],  // Allow necessary methods
//     allowedHeaders: ['Content-Type', 'Authorization'],  // Allow necessary headers
// }));
const allowedOrigins = [
    'https://localhost:5173',
    'https://malbec-fg0a7cfem-leandroatochkins-projects.vercel.app', // Vercel URL
    'https://localhost:4173'
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
app.options('https://malbec-fg0a7cfem-leandroatochkins-projects.vercel.app', cors());  // Handles OPTIONS requests for all routes

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

// app.use(session({
//     secret: 'your-secret-key',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         secure: true, // Ensures cookie is sent only over HTTPS
//         httpOnly: true,
//         sameSite: 'None' // Required for cross-origin cookies in recent browser versions
//     }
// }));



app.use(xss())

app.use(express.json()); // Parse incoming JSON data

app.use('/images', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // or '*' to allow all origins
    next();
}, express.static(path.join('C:/Malbec/IMAGENES')));



// const productRoute = require('./api/routes/products/db_productos.cjs')
// const categoryRoute = require('./api/routes/products/db_rubros.cjs')
// const checkoutRoute = require('./api/routes/create_checkout.cjs')
// const newUserRoute = require('./api/routes/users/db_new_user.cjs')
// const checkUserRoute = require('./api/routes/users/check_user.cjs')
// const deleteUserRoute = require('./api/routes/users/delete_user.cjs')
// const addAddressRoute = require('./api/routes/users/db_register_address.cjs')
// const getAddressRoute = require('./api/routes/users/db_retrieve_addresses.cjs')
// const getBusinessesRoute = require('./api/routes/businesses/db_retrieve_business.cjs')
// const getScheduleRoute = require('./api/routes/businesses/db_retrieve_schedule.cjs')
// const getCurrentTime = require('./api/routes/other/server_time.cjs')
// const deleteAddressRoute = require('./api/routes/users/db_delete_address.cjs')
// const getBusinessNumber = require('./api/routes/businesses/db_retrieve_business_data.cjs')
// const loginRoute = require('./api/routes/users/login_user.cjs')
// const sendVerificationEmailRoute = require('./api/routes/users/send_email_verification.cjs')
// const verifyEmailRoute = require('./api/routes/users/verify_email.cjs')
// const getBusinessDetails = require('./api/routes/businesses/db_retrieve_business_details.cjs')
// const uploadProductRoute = require('./api/routes/businesses/upload_products.cjs')
// const uploadCategoriesRoute = require('./api/routes/businesses/upload_categories.cjs')
// const uploadOrderStateRoute =  require('./api/routes/orders/upload_order_state.cjs')




// app.use('/api/productos', productRoute);
// app.use('/api/rubros', categoryRoute);
// app.use('/api/checkout', checkoutRoute);
// app.use('/api/register', newUserRoute);
// app.use('/api/check_user', checkUserRoute)
// app.use('/api/add_address', addAddressRoute)
// app.use('/api/get_address', getAddressRoute)
// app.use('/api/get_businesses', getBusinessesRoute)
// app.use('/api/delete_user', deleteUserRoute)
// app.use('/api/get_schedule', getScheduleRoute)
// app.use('/api/get_current_time', getCurrentTime)
// app.use('/api/delete_address', deleteAddressRoute)
// app.use('/api/get_business_number',  getBusinessNumber)
// app.use('/api/login', loginRoute)
// app.use('/api/send_verification_email', sendVerificationEmailRoute)
// app.use('/api/verify_email', verifyEmailRoute)
// app.use('/api/get_business_details', getBusinessDetails)
// app.use('/upload/producto', uploadProductRoute)
// app.use('/upload/rubro', uploadCategoriesRoute)
// app.use('upload/estado_pedido', uploadOrderStateRoute)

Object.entries(routes).forEach(([path, route]) => {
    app.use(path, require(route));
  });


cron.schedule('0 0 * * *', async () => {
    console.log('Running scheduled update for discount status');
    await updateDiscountStatus();
});



//https.createServer(options, app).listen(3000, ()=>{console.log('Server running on port 3000')})

app.listen(3000, ()=>{console.log('Server running on port 3000')})