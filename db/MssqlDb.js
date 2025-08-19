const sql = require("mssql");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const DBConnect = {
  user: "sa",
  password: "123",
  server: "localhost",
  database: "electric_store",

  port: 1433,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    trustedconnection: true,

    enableArithAbort: true,
  },
};

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
