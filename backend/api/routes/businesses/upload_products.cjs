const express = require('express');
const router = express.Router();
const db = require('../../db.cjs');
const parseFileData  = require('../../../parser.cjs');


router.post('/', async (req, res) => {
    try {
        const productoData = parseFileData(req.body.data, 'producto');

        const queries = productoData.map(item => {
            const { PD_cod_raz_soc, PD_cod_suc, PD_cod_pro, PD_des_pro, PD_cod_rub, PD_pre_ven, PD_ubi_imagen, PD_est } = item;
            let { PD_discount, PD_discount_DATE, PD_img_discount } = item;

            // Validate data and provide default values if needed
            if (typeof PD_cod_rub !== 'string' || PD_cod_rub.length > 10) {
                return Promise.reject(new Error(`Invalid PD_cod_rub: ${PD_cod_rub}`));
            }
            if (typeof PD_est !== 'string' || PD_est.length > 5) {
                return Promise.reject(new Error(`Invalid PD_est: ${PD_est}`));
            }
            if (isNaN(PD_pre_ven)) {
                return Promise.reject(new Error(`Invalid PD_pre_ven: ${PD_pre_ven}`));
            }

            // Set default values if PD_discount or PD_discount_DATE are missing
            PD_discount = PD_discount ?? 0; // Default discount to 0 if undefined
            PD_discount_DATE = PD_discount_DATE ?? null; // Set to null if date is undefined
            PD_img_discount = PD_img_discount ?? null; // Set to null if image is undefined

            const query = `
                INSERT INTO producto 
                (PD_cod_raz_soc, PD_cod_suc, PD_cod_pro, PD_des_pro, PD_cod_rub, PD_pre_ven, PD_ubi_imagen, PD_est, PD_discount, PD_discount_DATE, PD_img_discount) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
                ON DUPLICATE KEY UPDATE 
                    PD_des_pro = VALUES(PD_des_pro), 
                    PD_cod_rub = VALUES(PD_cod_rub), 
                    PD_pre_ven = VALUES(PD_pre_ven), 
                    PD_ubi_imagen = VALUES(PD_ubi_imagen), 
                    PD_est = VALUES(PD_est),
                    PD_discount = VALUES(PD_discount),
                    PD_discount_DATE = VALUES(PD_discount_DATE),
                    PD_img_discount = VALUES(PD_img_discount)
            `;

            return new Promise((resolve, reject) => {
                db.query(query, [
                    PD_cod_raz_soc, PD_cod_suc, PD_cod_pro, PD_des_pro, PD_cod_rub,PD_pre_ven, PD_ubi_imagen, PD_est, PD_discount, PD_discount_DATE, PD_img_discount
                ], (err) => {
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

module.exports = router