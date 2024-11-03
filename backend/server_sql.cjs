const express = require('express');
const app = express();
const db = require('../backend/api/db.cjs')
const bodyParser = require('body-parser');
const cors = require('cors')
const path = require('path')
const xss = require('xss-clean')
const  helmet = require('helmet')
const fs = require('fs');
const https = require('https')
const parseFileData = require('./parser.cjs')
const sendEmailNotification = require('./notification_mailer.cjs');
const { getUserDetails, getUserIdFromOrder } = require('./utils.cjs');
const session = require('express-session');

const options = {
    key: fs.readFileSync('C:/Users/leand/privkey.pem'),  // Replace with the correct path
    cert: fs.readFileSync('C:/Users/leand/cert.pem'),    // Replace with the correct path
  };


app.use(bodyParser.json());

const allowedOrigins = ['https://localhost:5173', 'https://jqkccp38-5173.brs.devtunnels.ms'];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin, like mobile apps or curl requests
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);  // Allow the origin
        } else {
            callback(new Error('Not allowed by CORS'));  // Reject other origins
        }
    },
    credentials: true,  // Allow credentials to be sent
    methods: ['GET', 'POST'],  // Allow necessary methods
    allowedHeaders: ['Content-Type', 'Authorization'],  // Specify allowed headers
}));


app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');  // Required if using credentials
    next();
});

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "default-src": ["'self'"],
            "img-src": ["'self'", "data:", "https://localhost:3000"],
            "upgrade-insecure-requests": [],
        },
    },
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: { policy: 'same-origin' }, // Ensure same-origin policy
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true, // Ensures cookie is sent only over HTTPS
        httpOnly: true,
        sameSite: 'None' // Required for cross-origin cookies in recent browser versions
    }
}));



app.use(xss())

app.use(express.json()); // Parse incoming JSON data

app.use('/images', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // or '*' to allow all origins
    next();
}, express.static(path.join('C:/Malbec/IMAGENES')));



const productRoute = require('./api/routes/products/db_productos.cjs')
const categoryRoute = require('./api/routes/products/db_rubros.cjs')
const checkoutRoute = require('./api/routes/create_checkout.cjs')
const newUserRoute = require('./api/routes/users/db_new_user.cjs')
const checkUserRoute = require('./api/routes/users/check_user.cjs')
const deleteUserRoute = require('./api/routes/users/delete_user.cjs')
const addAddressRoute = require('./api/routes/users/db_register_address.cjs')
const getAddressRoute = require('./api/routes/users/db_retrieve_addresses.cjs')
const getBusinessesRoute = require('./api/routes/businesses/db_retrieve_business.cjs')
const getScheduleRoute = require('./api/routes/businesses/db_retrieve_schedule.cjs')
const getCurrentTime = require('./api/routes/other/server_time.cjs')
const deleteAddressRoute = require('./api/routes/users/db_delete_address.cjs')
const getBusinessNumber = require('./api/routes/businesses/db_retrieve_business_id.cjs')
const loginRoute = require('./api/routes/users/login_user.cjs')
const sendVerificationEmailRoute = require('./api/routes/users/send_email_verification.cjs')
const verifyEmailRoute = require('./api/routes/users/verify_email.cjs')



app.use('/api/productos', productRoute);
app.use('/api/rubros', categoryRoute);
app.use('/api/checkout', checkoutRoute);
app.use('/api/register', newUserRoute);
app.use('/api/check_user', checkUserRoute)
app.use('/api/add_address', addAddressRoute)
app.use('/api/get_address', getAddressRoute)
app.use('/api/get_businesses', getBusinessesRoute)
app.use('/api/delete_user', deleteUserRoute)
app.use('/api/get_schedule', getScheduleRoute)
app.use('/api/get_current_time', getCurrentTime)
app.use('/api/delete_address', deleteAddressRoute)
app.use('/api/get_business_number',  getBusinessNumber)
app.use('/api/login', loginRoute)
app.use('/api/send_verification_email', sendVerificationEmailRoute)
app.use('/api/verify_email', verifyEmailRoute)



// Endpoint to upload rubro data
app.post('/upload/rubro', (req, res) => {
    const rubroData = parseFileData(req.body.data, 'rubro');

    if (!rubroData) {
        return res.status(400).json({ error: 'no data.' });
    }
    
    rubroData.forEach(item => {
        const { RB_cod_raz, RB_cod_suc, RB_cod_rub, RB_des_rub, RB_est } = item;
        const query = `INSERT INTO rubro (RB_cod_raz, RB_cod_suc, RB_cod_rub, RB_des_rub, RB_est)
                       VALUES (?, ?, ?, ?, ?)
                       ON DUPLICATE KEY UPDATE RB_des_rub = ?, RB_est = ?`;
        
        db.query(query, [RB_cod_raz, RB_cod_suc, RB_cod_rub, RB_des_rub, RB_est, RB_des_rub, RB_est], (err) => {
            if (err) {
                return res.status(500).json({ message: 'Database query error', error: err });
            }
        });
    });
    
    res.send('Rubro data uploaded');
});

// Endpoint to upload producto data
app.post('/upload/producto', async (req, res) => {
    try {
        const productoData = parseFileData(req.body.data, 'producto');

        const queries = productoData.map(item => {
            const { PD_cod_raz_soc, PD_cod_suc, PD_cod_pro, PD_des_pro, PD_cod_rub, PD_pre_ven, PD_ubi_imagen, PD_est } = item;

            // Validate data lengths and types
            if (typeof PD_cod_rub !== 'string' || PD_cod_rub.length > 10) { // Adjust length accordingly
                console.error(`Invalid PD_cod_rub: ${PD_cod_rub}`);
                return Promise.reject(new Error(`Invalid PD_cod_rub: ${PD_cod_rub}`));
            }
            if (typeof PD_est !== 'string' || PD_est.length > 5) { // Adjust length accordingly
                console.error(`Invalid PD_est: ${PD_est}`);
                return Promise.reject(new Error(`Invalid PD_est: ${PD_est}`));
            }
            if (isNaN(PD_pre_ven)) {
                console.error(`Invalid PD_pre_ven: ${PD_pre_ven}`);
                return Promise.reject(new Error(`Invalid PD_pre_ven: ${PD_pre_ven}`));
            }

            const query = `
                INSERT INTO producto 
                (PD_cod_raz_soc, PD_cod_suc, PD_cod_pro, PD_des_pro, PD_cod_rub, PD_pre_ven, PD_ubi_imagen, PD_est) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?) 
                ON DUPLICATE KEY UPDATE 
                    PD_des_pro = VALUES(PD_des_pro), 
                    PD_cod_rub = VALUES(PD_cod_rub), 
                    PD_pre_ven = VALUES(PD_pre_ven), 
                    PD_ubi_imagen = VALUES(PD_ubi_imagen), 
                    PD_est = VALUES(PD_est)`;

            return new Promise((resolve, reject) => {
                db.query(query, [PD_cod_raz_soc, PD_cod_suc, PD_cod_pro, PD_des_pro, PD_cod_rub, PD_pre_ven, PD_ubi_imagen, PD_est], (err) => {
                    if (err) {
                        console.error(`Failed to insert/update producto: ${err.message}`);
                        return reject(err);
                    }
                    resolve();
                });
            });
        });

        await Promise.all(queries);
        res.send('Producto data uploaded');
    } catch (err) {
        console.error(`Error uploading producto data: ${err.message}`);
        res.status(500).json({ message: 'Database query error', error: err.message });
    }
});



app.post('/upload/estado_pedido', (req, res) => {
    const stateData = parseFileData(req.body.data, 'estado_pedido');

    console.log(stateData)

    if (!stateData) {
        return res.status(400).json({ error: 'no data.' });
    }

    stateData.forEach(item => {
        const { EP_cod_raz_soc, EP_cod_suc, EP_fecha, EP_nro_ped, EP_tot_fin, EP_est } = item;

        const query = `UPDATE user_orders 
            SET state = ?, total = ?, fecha = ?
            WHERE PD_cod_raz_soc = ? 
              AND PD_cod_suc = ? 
              AND order_number = ?`;

        db.query(query, [EP_est, EP_tot_fin, EP_fecha, EP_cod_raz_soc, EP_cod_suc, EP_nro_ped], (err) => {
            if (err) {
                console.error(`Failed to insert/update pedido: ${err.message}`);
                return res.status(500).json({ message: 'Database query error', error: err });  
            }
        });

        if (EP_est === 4) {
            const sendNotification = async () => {

                try {
                    console.log('email sent to user')
                    // Check if the notification has already been sent
                    const checkNotificationQuery = `SELECT notification_sent FROM user_orders 
                        WHERE PD_cod_raz_soc = ? 
                        AND PD_cod_suc = ? 
                        AND order_number = ?`;

                    db.query(checkNotificationQuery, [EP_cod_raz_soc, EP_cod_suc, EP_nro_ped], async (err, results) => {
                        if (err) {
                            console.error("Error checking notification status:", err);
                            return res.status(500).json({ message: 'Database query error', error: err });
                        }

                        if (results.length && !results[0].notification_sent) {
                            // Notification hasn't been sent, proceed
                            const userId = await getUserIdFromOrder(EP_cod_raz_soc, EP_cod_suc, EP_nro_ped);
                            const userDetails = await getUserDetails(userId);
                            
                            // Send the email notification
                            sendEmailNotification(null, userDetails, false);

                            // Update the notification_sent flag
                            const updateNotificationQuery = `UPDATE user_orders 
                                SET notification_sent = 1 
                                WHERE PD_cod_raz_soc = ? 
                                AND PD_cod_suc = ? 
                                AND order_number = ?`;

                            db.query(updateNotificationQuery, [EP_cod_raz_soc, EP_cod_suc, EP_nro_ped], (err) => {
                                if (err) {
                                    console.error("Failed to update notification flag:", err);
                                }
                            });
                        }
                    });
                } catch (error) {
                    console.error('Failed to send notification:', error);
                }
            };

            // Call the async notification function
            sendNotification();
        }
    });

    res.send('Novedad uploaded');
});


https.createServer(options, app).listen(3000, ()=>{console.log('Server running on port 3000')})
