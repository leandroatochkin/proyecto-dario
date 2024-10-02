// utils.cjs
const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32); // Store this securely!
const iv = crypto.randomBytes(16);   // Store this securely as well

function encrypt(text) {
    if (!text) {
        throw new Error("No text provided for encryption.");
    }

    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function decrypt(text) {
    if (!text) {
        throw new Error("No text provided for decryption.");
    }

    const { iv, encryptedData } = JSON.parse(text);
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), Buffer.from(iv, 'hex'));

    let decrypted = decipher.update(Buffer.from(encryptedData, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

module.exports = { encrypt, decrypt };
