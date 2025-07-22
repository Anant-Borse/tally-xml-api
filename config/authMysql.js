// config/authMysql.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const authPool = mysql.createPool({
  host: process.env.AUTH_DB_HOST,
  user: process.env.AUTH_DB_USER,
  password: process.env.AUTH_DB_PASS,
  database: process.env.AUTH_DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default authPool;
