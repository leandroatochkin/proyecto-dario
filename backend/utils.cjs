// utils.cjs
const crypto = require('crypto');
const db = require('./api/db.cjs')

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


const getUserDetails = (userId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT email, phone, score FROM users WHERE id = ?`;
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error("Error fetching user details:", err);
        return reject(err);
      }
      if (results.length > 0) {
        resolve(results[0]); // Return the first (and only) user record
      } else {
        reject("User not found");
      }
    });
  });
};

const getProductName = (PD_cod_pro) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT PD_des_pro FROM producto WHERE PD_cod_pro = ?`;
      db.query(query, [PD_cod_pro], (err, results) => {
        if (err) {
          console.error("Error fetching product details:", err);
          return reject(err);
        }
        if (results.length > 0) {
          resolve(results[0].PD_des_pro); // Return product name
        } else {
          reject("Product not found");
        }
      });
    });
  };

  const getUserIdFromOrder = (EP_cod_raz_soc, EP_cod_suc, EP_nro_ped) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT user_id FROM user_orders WHERE PD_cod_raz_soc = ? AND  PD_cod_suc = ? AND order_number = ?`;
      db.query(query, [EP_cod_raz_soc, EP_cod_suc, EP_nro_ped], (err, results) => {
        if (err) {
          console.error("Error fetching user_id:", err);
          return reject(err);
        }
        if (results.length > 0) {
          resolve(results[0].user_id); 
        } else {
          reject("Product not found");
        }
      });
    });
  };

  const getAddressType = (address) => {
    switch(address){
      case '1': return 'CASA';
      case '2': return 'TRABAJO';
      case '3': return 'OTRO';
      default: return ''; 
    }               
  };

  const getComission = (total, comission) => (total / 100) * comission;

  
  

module.exports = { encrypt, decrypt, getUserDetails, getProductName, getAddressType, getComission, getUserIdFromOrder };
