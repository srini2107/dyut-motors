// lib/db.js
import mysql from "mysql2/promise";

const db = await mysql.createPool({
  host: "localhost",
  user: "root1",
  password: "root1",
  database: "myDB1",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;
