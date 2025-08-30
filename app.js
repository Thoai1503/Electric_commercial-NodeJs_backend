const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });
const colors = require("colors");
const express = require("express");
const connectDB = require("./db/MongoDb");
const { getPool } = require("./db/MssqlDb");
const app = express();
const authRouter = require("./router/auth");
const userRouter = require("./router/user");
const brandRouter = require("./router/brand");
const categoryRouter = require("./router/category");

const cors = require("cors");

const morgan = require("morgan");
const path = require("path");

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://electric-commercial.vercel.app/",
    ],
    credentials: true, // allow cookie/credentials entry
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/brand", brandRouter);
app.use("/api/v1/category", categoryRouter);

getPool()
  .then(() => {
    console.log("MSSQL Database connected successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MSSQL Database:", err);
  });

app.use((req, res, next) => {
  console.log("Time:", Date.now());
  next();
});

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);

  // Close server & exit process
  // server.close(() => process.exit(1));
});
module.exports = app;
