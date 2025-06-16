// lib/db.js
// import mysql from "mysql2/promise";

// const db = await mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "root",
//   database: "myDB",
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// export default db;


// lib/db.js
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Add this in your .env file
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;

