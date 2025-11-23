const crypto = require("crypto");
const qs = require("qs");

function sortParamsForSigning(params) {
  const sortedKeys = Object.keys(params)
    .filter((k) => params[k] !== undefined && params[k] !== null && params[k] !== "")
    .sort();
  const sorted = {};
  for (const key of sortedKeys) {
    sorted[key] = params[key];
  }
  return sorted;
}

function buildQuery(params) {
  return qs.stringify(params, { encode: false });
}

function hmacSha256(data, secret) {
  return crypto.createHmac("sha256", secret).update(Buffer.from(data, "utf-8")).digest("hex");
}

function hmacSha512(data, secret) {
  return crypto.createHmac("sha512", secret).update(Buffer.from(data, "utf-8")).digest("hex");
}

module.exports = {
  sortParamsForSigning,
  buildQuery,
  hmacSha256,
  hmacSha512,
};







