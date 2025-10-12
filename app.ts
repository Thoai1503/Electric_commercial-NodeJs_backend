import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });
import fileUpload from "express-fileupload";
import colors from "colors";
import express, { Request, Response } from "express";
import connectDB from "./db/MongoDb";
import { getPool } from "./db/MssqlDb";
import authRouter from "./router/auth";
import userRouter from "./router/user";
import brandRouter from "./router/brand";
import categoryRouter from "./router/category";
import cookieParser from "cookie-parser";
import cors from "cors";
//import morgan from "morgan";
import path from "path";
import VNPayPaymentRouter from "./router/VNPay_payment";
import MoMoPaymentRouter from "./router/MOMO_payment";

const app = express();

//app.use(fileUpload({ limits: { fileSize: 100 * 1024 * 1024 } }));

app.use(
  cors({
    origin: ["https://electric-commercial.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(morgan("dev"));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/brand", brandRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/payment", VNPayPaymentRouter);
app.use("/api/v1/momo-payment", MoMoPaymentRouter);

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

app.post("/api/upload", (req: Request, res: Response) => {
  const files = (req as any).files?.images;
  if (!files) {
    return res.status(400).json({ message: "No files were uploaded." });
  }
  const list = Array.isArray(files) ? files : [files];
  list.forEach((file: any) => {
    const uploadPath = path.join(__dirname, "uploads", Date.now() + file.name);
    file.mv(uploadPath, (err: any) => {
      if (err) return res.status(500).json({ error: err.message });
    });
  });
  const uploadedFiles = list.map((file: any) => ({
    name: file.name,
    mimetype: file.mimetype,
    size: file.size,
  }));
  res.json({ message: "Upload thành công!", files: uploadedFiles });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});

process.on("unhandledRejection", (err: any) => {
  console.log(`Error: ${err.message}`.red);
});

export default app;
