/**
 * connection.js
 * MySQL connection using mysql2 and environment variables.
 * If you don't want to use a .env file, set the environment variables
 * in your shell before starting the server.
 */

const mysql = require('mysql2');

// load .env if present (harmless if dotenv isn't installed)
try { require('dotenv').config(); } catch(e) {}

// Read credentials from environment (with sensible defaults)
const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_USER = process.env.DB_USER || process.env.MYSQL_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || process.env.MYSQL_DATABASE || 'ayushcafe';
const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;

// Create a pool so connections auto-recover and are reused
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export promise-based pool wrapper
const promisePool = pool.promise();

promisePool.getConnection()
  .then(conn => {
    console.log('MySQL pool connected as id', conn.threadId || '(pool)');
    conn.release();
  }).catch(err => {
    console.error('MySQL connection error (check env vars/.env):', err.message);
  });

module.exports = promisePool;
