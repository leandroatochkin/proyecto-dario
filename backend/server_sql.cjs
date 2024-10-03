const express = require('express');
const app = express();
const db = require('../backend/api/db.cjs')
const bodyParser = require('body-parser');
const cors = require('cors')

app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:5173',
  }));


app.use(express.json()); // Parse incoming JSON data


const productRoute = require('./api/routes/db_productos.cjs')
const categoryRoute = require('./api/routes/db_rubros.cjs')
const checkoutRoute = require('./api/routes/create_checkout.cjs')
const newUserRoute = require('./api/routes/db_new_user.cjs')
const checkUserRoute = require('./api/routes/check_user.cjs')
const addAddressRoute = require('./api/routes/db_register_address.cjs')
const getAddressRoute = require('./api/routes/db_retrieve_addresses.cjs')


app.use('/api/productos', productRoute);
app.use('/api/rubros', categoryRoute);
app.use('/api/checkout', checkoutRoute);
app.use('/api/register', newUserRoute);
app.use('/api/check_user', checkUserRoute)
app.use('/api/add_address', addAddressRoute)
app.use('/api/get_address', getAddressRoute)

// Helper function to parse the text data into structured rows
const parseFileData = (fileData, isRubro) => {
    const rows = fileData.split(';').filter(line => line.trim());
    return rows.map(row => {
        const columns = row.split(',').map(col => col.trim());
        return isRubro 
            ? { RB_cod_raz: columns[0], RB_cod_suc: columns[1], RB_cod_rub: columns[2], RB_des_rub: columns[3], RB_est: columns[4] }
            : { PD_cod_raz_soc: columns[0], PD_cod_suc: columns[1], PD_cod_pro: columns[2], PD_des_pro: columns[3], PD_cod_rub: columns[4], PD_pre_ven: parseFloat(columns[5]),  PD_ubi_imagen: columns[6], PD_est: columns[7] };
    });
};

// Endpoint to upload rubro data
app.post('/upload/rubro', (req, res) => {
    const rubroData = parseFileData(req.body.data, true);
    
    rubroData.forEach(item => {
        const { RB_cod_raz, RB_cod_suc, RB_cod_rub, RB_des_rub, RB_est } = item;
        const query = `INSERT INTO rubro (RB_cod_raz, RB_cod_suc, RB_cod_rub, RB_des_rub, RB_est)
                       VALUES (?, ?, ?, ?, ?)
                       ON DUPLICATE KEY UPDATE RB_des_rub = ?, RB_est = ?`;
        
        db.query(query, [RB_cod_raz, RB_cod_suc, RB_cod_rub, RB_des_rub, RB_est, RB_des_rub, RB_est], (err) => {
            if (err) throw err;
        });
    });
    
    res.send('Rubro data uploaded');
});

// Endpoint to upload producto data
app.post('/upload/producto', (req, res) => {
    const productoData = parseFileData(req.body.data, false);
    
    productoData.forEach(item => {
        const { PD_cod_raz_soc, PD_cod_suc, PD_cod_pro, PD_des_pro, PD_cod_rub, PD_pre_ven, PD_ubi_imagen, PD_est } = item;

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

        db.query(query, [PD_cod_raz_soc, PD_cod_suc, PD_cod_pro, PD_des_pro, PD_cod_rub, PD_pre_ven, PD_ubi_imagen, PD_est], (err) => {
            if (err) {
                console.error(`Failed to insert/update producto: ${err.message}`);
            }
        });
    });

    res.send('Producto data uploaded');
});


// Start the server
app.listen(3000, () => console.log('Server running on port 3000'));
