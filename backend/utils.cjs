// utils.cjs
const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex')
const iv = crypto.randomBytes(16);  // Store this securely as well

function encrypt(text) {
    if (!text) {
        throw new Error("No text provided for encryption.");
    }

    const iv = crypto.randomBytes(16); // Create a new IV for each encryption
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function decrypt(encryptedData) {
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), Buffer.from(encryptedData.iv, 'hex'));
    let decrypted = decipher.update(Buffer.from(encryptedData.encryptedData, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

module.exports = { encrypt, decrypt };
