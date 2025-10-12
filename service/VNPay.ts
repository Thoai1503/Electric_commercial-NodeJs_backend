import IPaymentService from "./IPaymentService";
import { sortParamsForSigning, buildQuery, hmacSha512 } from "./paymentUtils";

type VNPayConfig = {
  tmnCode: string | undefined;
  hashSecret: string | undefined;
  vnpUrl: string | undefined;
  returnUrl: string | undefined;
};

export default class VNPay extends IPaymentService {
  private readonly tmnCode: string;
  private readonly hashSecret: string;
  private readonly vnpUrl: string;
  private readonly returnUrl: string;

  constructor(config: VNPayConfig) {
    super();
    this.tmnCode = String(config.tmnCode || "");
    this.hashSecret = String(config.hashSecret || "");
    this.vnpUrl = String(config.vnpUrl || "");
    this.returnUrl = String(config.returnUrl || "");
  }

  async createPayment(orderId: string, amount: number | string, options: Record<string, unknown> = {}): Promise<{ paymentUrl: string }> {
    const now = new Date(Date.now() + 7 * 60 * 60 * 1000);
    const pad = (n: number) => (n < 10 ? "0" + n : "" + n);
    const createDate = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

    let params: Record<string, unknown> = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: this.tmnCode,
      vnp_Locale: (options.locale as string) === "en" ? "en" : "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: orderId,
      vnp_OrderInfo: (options.orderInfo as string) || `Thanh toan don hang: ${orderId}`,
      vnp_OrderType: (options.orderType as string) || "other",
      vnp_Amount: Math.round(Number(amount) * 100),
      vnp_ReturnUrl: this.returnUrl,
      vnp_IpAddr: (options.ipAddress as string) || "127.0.0.1",
      vnp_CreateDate: createDate,
    };

    if (options.bankCode) {
      params.vnp_BankCode = options.bankCode;
    }

    params = sortParamsForSigning(params);
    const signData = buildQuery(params);
    const signature = hmacSha512(signData, this.hashSecret);
    (params as Record<string, unknown>).vnp_SecureHash = signature;

    const paymentUrl = `${this.vnpUrl}?${buildQuery(params)}`;
    return { paymentUrl };
  }

  async returnPayment(queryParams: Record<string, string>): Promise<{ isValid: boolean; params: Record<string, unknown> }> {
    const receivedHash = queryParams.vnp_SecureHash as string;
    const params: Record<string, unknown> = { ...queryParams };
    delete (params as Record<string, unknown>).vnp_SecureHash;
    delete (params as Record<string, unknown>).vnp_SecureHashType;
    const sorted = sortParamsForSigning(params);
    const signData = buildQuery(sorted);
    const calculated = hmacSha512(signData, this.hashSecret);
    const isValid = receivedHash === calculated;
    return { isValid, params: sorted };
  }
}


