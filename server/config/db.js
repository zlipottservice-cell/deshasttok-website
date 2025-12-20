const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Determine Database Port
// Priority: 1. DB_PORT, 2. A default (3306)
// We avoid using the general 'PORT' variable on Railway as it belongs to the Web Server.
const dbPort = process.env.DB_PORT || 3306;

console.log(`📡 Database Config: Host=${process.env.DB_HOST}, Port=${dbPort}, User=${process.env.DB_USER}, DB=${process.env.DB_NAME}`);

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
        console.error('❌ DATABASE CONNECTION FAILED');
        console.error('--------------------------------');
        console.error('Error Code:', err.code);
        console.error('Error Message:', err.message);
        console.error('Error No:', err.errno);
        console.error('--------------------------------');
        console.log('TIP: Ensure DB_HOST and DB_PORT (21588) are correct in Railway Variables.');
        console.log('TIP: Ensure Aiven Firewall (IP Whitelist) is set to 0.0.0.0/0.');
    } else {
        console.log('✅ DATABASE CONNECTED SUCCESSFULLY (Aiven MySQL)');
        connection.release();
    }
});

module.exports = pool.promise();
