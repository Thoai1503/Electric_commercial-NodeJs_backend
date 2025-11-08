import IPaymentService from "./IPaymentService";
import { hmacSha256 } from "./paymentUtils";
import axios from "axios";

type MoMoConfig = {
  partnerCode?: string;
  accessKey?: string;
  secretKey?: string;
  redirectUrl?: string;
  ipnUrl?: string;
  endpoint?: string;
};

export default class MoMo extends IPaymentService {
  private readonly partnerCode: string;
  private readonly accessKey: string;
  private readonly secretKey: string;
  private readonly redirectUrl: string;
  private readonly ipnUrl: string;
  private readonly endpoint: string;

  constructor(config: MoMoConfig) {
    super();
    this.partnerCode = String(config.partnerCode || "");
    this.accessKey = String(config.accessKey || "");
    this.secretKey = String(config.secretKey || "");
    this.redirectUrl = String(config.redirectUrl || "");
    this.ipnUrl = String(config.ipnUrl || "");
    this.endpoint = String(config.endpoint || "https://test-payment.momo.vn/v2/gateway/api/create");
  }

  async createPayment(orderId: string, amount: number | string, options: Record<string, unknown> = {}): Promise<{ payUrl: string; response: unknown }> {
    const requestId = `${this.partnerCode}${Date.now()}`;
    const requestType = (options.requestType as string) || "captureWallet";
    const orderInfo = (options.orderInfo as string) || `Thanh toan don hang: ${orderId}`;
    const extraData = (options.extraData as string) || "";

    const rawSignature =
      `accessKey=${this.accessKey}` +
      `&amount=${amount}` +
      `&extraData=${extraData}` +
      `&ipnUrl=${this.ipnUrl}` +
      `&orderId=${orderId}` +
      `&orderInfo=${orderInfo}` +
      `&partnerCode=${this.partnerCode}` +
      `&redirectUrl=${this.redirectUrl}` +
      `&requestId=${requestId}` +
      `&requestType=${requestType}`;

    const signature = hmacSha256(rawSignature, this.secretKey);

    const payload = {
      partnerCode: this.partnerCode,
      accessKey: this.accessKey,
      requestId,
      amount: `${amount}`,
      orderId,
      orderInfo,
      redirectUrl: this.redirectUrl,
      ipnUrl: this.ipnUrl,
      extraData,
      requestType,
      signature,
      lang: (options.lang as string) || "vi",
    };

    const response = await axios.post(this.endpoint, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return { payUrl: (response.data as any).payUrl, response: response.data };
  }

  async returnPayment(queryParams: Record<string, string>): Promise<{ params: Record<string, string> }> {
    return { params: queryParams };
  }
}






