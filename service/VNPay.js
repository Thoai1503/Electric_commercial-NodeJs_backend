const IPaymentService = require("./IPaymentService");
const {
  sortParamsForSigning,
  buildQuery,
  hmacSha512,
} = require("../utils/paymentUtils");

class VNPay extends IPaymentService {
  constructor(config) {
    super();
    this.tmnCode = config.tmnCode;
    this.hashSecret = config.hashSecret;
    this.vnpUrl = config.vnpUrl;
    this.returnUrl = config.returnUrl;
  }

  async createPayment(orderId, amount, options = {}) {
    const now = new Date(Date.now() + 7 * 60 * 60 * 1000);
    const pad = (n) => (n < 10 ? "0" + n : "" + n);
    const createDate = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(
      now.getDate()
    )}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

    let params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: this.tmnCode,
      vnp_Locale: options.locale === "en" ? "en" : "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: orderId,
      vnp_OrderInfo: options.orderInfo || `Thanh toan don hang: ${orderId}`,
      vnp_OrderType: options.orderType || "other",
      vnp_Amount: Math.round(Number(amount) * 100),
      vnp_ReturnUrl: this.returnUrl,
      vnp_IpAddr: options.ipAddress || "127.0.0.1",
      vnp_CreateDate: createDate,
    };

    if (options.bankCode) {
      params.vnp_BankCode = options.bankCode;
    }

    params = sortParamsForSigning(params);
    const signData = buildQuery(params);
    const signature = hmacSha512(signData, this.hashSecret);
    params.vnp_SecureHash = signature;

    const paymentUrl = `${this.vnpUrl}?${buildQuery(params)}`;
    return { paymentUrl };
  }

  async returnPayment(queryParams) {
    const receivedHash = queryParams.vnp_SecureHash;
    const params = { ...queryParams };
    delete params.vnp_SecureHash;
    delete params.vnp_SecureHashType;
    const sorted = sortParamsForSigning(params);
    const signData = buildQuery(sorted);
    const calculated = hmacSha512(signData, this.hashSecret);
    const isValid = receivedHash === calculated;
    return { isValid, params: sorted };
  }
}

module.exports = VNPay;
