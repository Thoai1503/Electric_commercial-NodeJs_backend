const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from the correct path
dotenv.config({ path: path.join(__dirname, "../config/config.env") });

const sql = require("mssql");

// Debug environment variables
console.log('Environment variables:');
console.log('USER:', process.env.USER);
console.log('PASSWORD:', process.env.PASSWORD ? '***' : 'undefined');
console.log('DB_SERVER:', process.env.DB_SERVER);
console.log('DB:', process.env.DB);

const DBConnect = {
  user: process.env.USER,
  password: process.env.PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB,
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    trustedconnection: true,
    enableArithAbort: true,
  },
};

// Validate required configuration
if (!DBConnect.server) {
  throw new Error('DB_SERVER environment variable is required');
}
if (!DBConnect.user) {
  throw new Error('USER environment variable is required');
}
if (!DBConnect.password) {
  throw new Error('PASSWORD environment variable is required');
}
if (!DBConnect.database) {
  throw new Error('DB environment variable is required');
}

// Create a single pool (best practice)
let pool;

async function getPool() {
  if (!pool) {
    pool = await sql.connect(DBConnect);
    let request = await pool.request().query("select * from users"); // Adjust the table name as needed
    // Simple query to test connection

    console.log("Result:", request.recordset); // Log the result of the query
  }

  console.log("✅ Connected to MSSQL");

  return pool;
}

module.exports = { sql, getPool };

// const sql = require("mssql");
// const dotenv = require("dotenv");
// dotenv.config({ path: "./config/config.env" });
// const DBConnect = {
//   user: "John333_SQLLogin_1",
//   password: "1etw5yoon4",
//   server: "Catalog_ElectricStoreDB.mssql.somee.com",
//   database: "Catalog_ElectricStoreDB",

//   port: 1433,
//   options: {
//     encrypt: true,
//     trustServerCertificate: true,
//     trustedconnection: true,

//     enableArithAbort: true,
//   },
// };

// // Create a single pool (best practice)
// let pool;

// async function getPool() {
//   if (!pool) {
//     pool = await sql.connect(DBConnect);
//     let request = await pool.request().query("select * from users"); // Adjust the table name as needed
//     // Simple query to test connection

//     console.log("Result:", request.recordset); // Log the result of the query
//   }

//   console.log("✅ Connected to MSSQL");

//   return pool;
// }

// module.exports = { sql, getPool };
