const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        ca: process.env.CA_CERTIFICATE,
        rejectUnauthorized: true
    }
});

module.exports = pool;