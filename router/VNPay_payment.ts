import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });
import express, { Request, Response } from "express";
import VNPay from "../service/VNPay";

const router = express.Router();

function getClientIp(req: Request): string {
  return (
    (req.headers["x-forwarded-for"] as string) ||
    (req.connection as any).remoteAddress ||
    (req.socket as any).remoteAddress ||
    (req.connection as any).socket?.remoteAddress ||
    "127.0.0.1"
  );
}

const vnpService = new VNPay({
  tmnCode: process.env.vnp_TmnCode,
  hashSecret: process.env.vnp_HashSecret,
  vnpUrl: process.env.vnp_Url,
  returnUrl: process.env.vnp_ReturnUrl,
});

router.post("/create_payment_url", async (req: Request, res: Response) => {
  try {
    const orderId = (req.body?.orderId as string) || `${Date.now()}`;
    const amount = (req.body?.amount as number) || 100000;
    const payment = await vnpService.createPayment(orderId, amount, {
      ipAddress: getClientIp(req),
      orderInfo: req.body?.orderInfo,
      bankCode: req.body?.bankCode,
      orderType: req.body?.orderType,
      locale: req.body?.language,
    });
    return res.status(200).json({ url: payment.paymentUrl });
  } catch (e) {
    console.error("Error creating VNPAY url:", e);
    return res.status(500).json({ error: "Failed to create payment URL" });
  }
});

router.get("/vnpay_return", async (req: Request, res: Response) => {
  try {
    const verification = await vnpService.returnPayment(req.query as any);
    if (verification.isValid) {
      return res.json({ code: verification.params.vnp_ResponseCode, orderId: verification.params.vnp_TxnRef, amount: verification.params.vnp_Amount });
    }
    return res.status(400).json({ code: "97", message: "Invalid signature" });
  } catch (e) {
    console.error("Error verifying VNPAY return:", e);
    return res.status(500).json({ error: "Payment verification failed" });
  }
});

export default router;


