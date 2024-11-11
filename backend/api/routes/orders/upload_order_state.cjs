const express = require('express');
const router = express.Router();
const db = require('../../db.cjs');
const parseFileData  = require('../../../parser.cjs');
const {sendEmailNotification} = require('../../../notification_mailer.cjs');
const { getUserDetails, getUserIdFromOrder } = require('../../../utils.cjs');
const {ValidationError, ServerError} = require('../../../middleware/error_handling/error_models.cjs')

router.post('/', (req, res, next) => {
    const stateData = parseFileData(req.body.data, 'estado_pedido');

    console.log(stateData)

    if (!stateData) {

        return next(new ValidationError('no data'))  

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

                return next(new  ServerError('Failed to insert/update pedido', err))
            }
        });

        if (EP_est === 4) {
            const sendNotification = async () => {
                try {
                    console.log('email sent to user');
                    // Check if the notification has already been sent
                    const checkNotificationQuery = `SELECT notification_sent FROM user_orders 
                        WHERE PD_cod_raz_soc = ? 
                        AND PD_cod_suc = ? 
                        AND order_number = ?`;
            
                    db.query(checkNotificationQuery, [EP_cod_raz_soc, EP_cod_suc, EP_nro_ped], async (err, results) => {
                        if (err) {
                            console.error("Error checking notification status:", err);
                            return next(new ServerError('Database query error', err))
                        }
            
                        if (results.length && !results[0].notification_sent) {
                            // Notification hasn't been sent, proceed
                            try {
                                const userId = await getUserIdFromOrder(EP_cod_raz_soc, EP_cod_suc, EP_nro_ped);
                                const userDetails = await getUserDetails(userId);
            
                                // Send the email notification
                                await sendEmailNotification(null, userDetails, false); // Make sure this is async if it returns a promise
            
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
                            } catch (userError) {
                                console.error('Failed to retrieve user details or send notification:', userError);
                            }
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

module.exports = router