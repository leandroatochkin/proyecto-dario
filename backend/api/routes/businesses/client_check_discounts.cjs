const express = require('express');
const router = express.Router();
const db = require('../../db.cjs'); // Adjust based on your database configuration

// Route to manually trigger the check (optional)
router.post('/updateDiscountStatus', async (req, res) => {
    try {
        await updateDiscountStatus();
        res.send('Discount status updated based on dates');
    } catch (error) {
        console.error(`Error updating discount status: ${error.message}`);
        res.status(500).json({ message: 'Error updating discount status' });
    }
});

// Function to check dates and update records
const updateDiscountStatus = async () => {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');

    const query = 
        `UPDATE producto 
        SET PD_est = 'A', PD_discount = '00' 
        WHERE PD_discount_DATE <= ?`
    ;

    db.query(query, [today], (err, result) => {
        if (err) {
            console.error(`Database error: ${err.message}`);
        } else {
            console.log(`${result.affectedRows} records updated`);
        }
    });
}


module.exports = router, {updateDiscountStatus}
