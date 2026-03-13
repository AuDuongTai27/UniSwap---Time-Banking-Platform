const mysql = require('mysql2/promise');
require('dotenv').config();

/*
  Create MySQL connection pool.
  Using pool improves performance and handles multiple connections safely.
*/

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;