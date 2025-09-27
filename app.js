const dotenv = require("dotenv");
//import multer from "multer";
dotenv.config({ path: "./config/config.env" });
const fileUpload = require("express-fileupload");
const colors = require("colors");
const express = require("express");
const connectDB = require("./db/MongoDb");
const { getPool } = require("./db/MssqlDb");
const app = express();
//const upload = multer({ storage: multer.memoryStorage() });
app.use(fileUpload({ limits: { fileSize: 100 * 1024 * 1024 } }));
const authRouter = require("./router/auth");
const userRouter = require("./router/user");
const brandRouter = require("./router/brand");
const categoryRouter = require("./router/category");
var cookieParser = require("cookie-parser");
const cors = require("cors");

const morgan = require("morgan");
const path = require("path");

app.use(
  cors({
    origin: ["https://electric-commercial.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // nếu cần cookie
  })
);
app.use(cookieParser());
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
app.post("/api/upload", (req, res) => {
  if (!req.files || !req.files.images) {
    return res.status(400).json({ message: "No files were uploaded." });
  }

  const files = Array.isArray(req.files.images)
    ? req.files.images
    : [req.files.images];

  files.forEach((file) => {
    const uploadPath = path.join(__dirname, "uploads", Date.now() + file.name);

    file.mv(uploadPath, (err) => {
      if (err) return res.status(500).json({ error: err.message });
    });
  });

  const uploadedFiles = files.map((file) => ({
    name: file.name,
    mimetype: file.mimetype,
    size: file.size,
  }));

  console.log("Data:", uploadedFiles);
  res.json({
    message: "Upload thành công!",
    files: uploadedFiles,
  });
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
