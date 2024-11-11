const express = require('express');
const router = express.Router();
const db = require('../../db.cjs');
const { decrypt } = require('../../../utils.cjs');
const { ServerError} = require('../../../middleware/error_handling/error_models.cjs')

router.post('/', (req, res, next) => {
    const { userId } = req.body;

    // Query to get all addresses for the user
    db.query('SELECT id, address, address_type FROM user_addresses WHERE user_id = ?', userId, (err, results) => {
        if (err) {

            return next(new  ServerError('Database query error', err)) 

        }

        if (results.length === 0) {
            return res.status(200).json({ message: 'No addresses found for this user', exists: false });
        }

        try {
            // Loop through the results and decrypt each address
            const decryptedAddresses = results.map(({ id, address, address_type }) => {


                // Parse the encrypted address
                const parsedAddress = JSON.parse(address);

                // Decrypt the address
                const decryptedAddress = decrypt(parsedAddress);

                return {
                    id: id,
                    address: decryptedAddress,
                    type: address_type
                };
            });

            // Return all decrypted addresses
            return res.status(200).json({ addresses: decryptedAddresses });
        } catch (error) {
            console.error('Error decrypting addresses:', error);

            return next(new  ServerError('Error decrypting addresses', error)) ;

        }
    });
});

module.exports = router;
