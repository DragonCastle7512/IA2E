const bcrypt = require('bcrypt');

async function hash(plain) {
    return await bcrypt.hash(plain, 10);
}

async function compareHash(plainValue, hashedValue) {
    return await bcrypt.compare(plainValue, hashedValue);
}

module.exports = { hash, compareHash };