const IPaymentService = require("./IPaymentService");
const { hmacSha256 } = require("../utils/paymentUtils");
const axios = require("axios");

class MoMo extends IPaymentService {
  constructor(config) {
    super();
    this.partnerCode = config.partnerCode;
    this.accessKey = config.accessKey;
    this.secretKey = config.secretKey;
    this.redirectUrl = config.redirectUrl;
    this.ipnUrl = config.ipnUrl;
    this.endpoint =
      config.endpoint || "https://test-payment.momo.vn/v2/gateway/api/create";
  }

  async createPayment(orderId, amount, options = {}) {
    const requestId = `${this.partnerCode}${Date.now()}`;
    const requestType = options.requestType || "captureWallet";
    const orderInfo = options.orderInfo || `Thanh toan don hang: ${orderId}`;
    const extraData = options.extraData || "";

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
      lang: options.lang || "vi",
    };

    const response = await axios.post(this.endpoint, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return { payUrl: response.data.payUrl, response: response.data };
  }

  async returnPayment(queryParams) {
    // For MoMo, verification is usually done using IPN signature; implement when needed
    return { params: queryParams };
  }
}

module.exports = MoMo;
