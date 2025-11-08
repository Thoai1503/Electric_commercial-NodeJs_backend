import crypto from "crypto";
import qs from "qs";

// export function sortParamsForSigning<T extends Record<string, unknown>>(params: T): Record<string, unknown> {
//   const sortedKeys = Object.keys(params)
//     .filter((k) => (params as Record<string, unknown>)[k] !== undefined && (params as Record<string, unknown>)[k] !== null && (params as Record<string, unknown>)[k] !== "")
//     .sort();
//   const sorted: Record<string, unknown> = {};
//   for (const key of sortedKeys) {
//     sorted[key] = (params as Record<string, unknown>)[key];
//   }
//   return sorted;
// }
// function sortParamsForSigning(obj:any) {
//   var sorted = {};
//   var str = [];
//   var key;
//   for (key in obj) {
//     if (obj.hasOwnProperty(key)) {
//       str.push(encodeURIComponent(key));
//     }
//   }
//   str.sort();
//   for (key = 0; key < str.length; key++) {
//     sorted[str[key]] = encodeURIComponent(
//       obj[str[key]]
//     ).replace(/%20/g, "+");
//   }
//   return sorted;
// }

export function sortParamsForSigning(obj: any) {
  const sorted: { [key: string]: string } = {};
  const str: string[] = [];
  let key: string;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (let i = 0; i < str.length; i++) {
    sorted[str[i]] = encodeURIComponent(
      obj[decodeURIComponent(str[i])]
    ).replace(/%20/g, "+");
  }
  return sorted;
}

export function buildQuery(params: Record<string, unknown>): string {
  return qs.stringify(params, { encode: false });
}

export function hmacSha256(data: string, secret: string): string {
  return crypto
    .createHmac("sha256", secret)
    .update(Buffer.from(data, "utf-8"))
    .digest("hex");
}

export function hmacSha512(data: string, secret: string): string {
  return crypto
    .createHmac("sha512", secret)
    .update(Buffer.from(data, "utf-8"))
    .digest("hex");
}




