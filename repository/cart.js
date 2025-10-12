module.exports = class CartRepository {
  constructor() {}

  async addToUserId(cart) {
    const { sql, getPool } = require("../db/MssqlDb");
    const pool = await getPool();
    const request = pool.request();
  }
};
