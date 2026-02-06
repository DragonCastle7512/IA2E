const CryptoJS = require('crypto-js');

const secretKey = process.env.CRYPTO_SECRET_KEY;

function encrypt(data) {
    return CryptoJS.AES.encrypt(data, secretKey).toString();
}

function decrypt(data) {
    return CryptoJS.AES.decrypt(data, secretKey).toString(CryptoJS.enc.Utf8);
}

module.exports = { encrypt, decrypt };