const crypto = require("crypto");
const qs = require("qs");

function sortParamsForSigning(obj) {
  var sorted = {};
  var str = [];
  var key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

function buildQuery(params) {
  return qs.stringify(params, { encode: false });
}

function hmacSha256(data, secret) {
  return crypto
    .createHmac("sha256", secret)
    .update(Buffer.from(data, "utf-8"))
    .digest("hex");
}

function hmacSha512(data, secret) {
  return crypto
    .createHmac("sha512", secret)
    .update(Buffer.from(data, "utf-8"))
    .digest("hex");
}

module.exports = {
  sortParamsForSigning,
  buildQuery,
  hmacSha256,
  hmacSha512,
};
