const express = require('express');
const router = express.Router();
const db = require('../../db.cjs');
const parseFileData  = require('../../../parser.cjs');


router.post('/', (req, res) => {
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

module.exports = router