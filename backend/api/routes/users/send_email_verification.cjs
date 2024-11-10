require('dotenv').config();
const express = require('express');
const router = express.Router();
const { sendEmailVerification } = require('../../../notification_mailer.cjs');
const {ValidationError} = require('../../../middleware/error_handling/error_models.cjs')

const frontEndHost = process.env.FRONT_END_HOST

router.post('/', (req, res) => {
    const { email, userId } = req.body;

    const link = `${frontEndHost}/verification?id=${userId}`

    // Check if addresses array is present and contains at least one address
    if (!email && !userId) {

        throw new  ValidationError('No email.');

    }

    sendEmailVerification(email, link)




});

module.exports = router;
