const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Determine Database Port
// Priority: 1. DB_PORT, 2. A default (3306)
// We avoid using the general 'PORT' variable on Railway as it belongs to the Web Server.
const dbPort = process.env.DB_PORT || 3306;

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(dbPort),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'exam_practice',
    ssl: {
        rejectUnauthorized: false
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ DATABASE CONNECTION FAILED:', err.message);
    } else {
        console.log('✅ DATABASE CONNECTED SUCCESSFULLY (Aiven MySQL)');
        connection.release();
    }
});

module.exports = pool.promise();
