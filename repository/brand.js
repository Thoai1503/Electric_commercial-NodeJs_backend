const Brand = require("../model/Brand");

module.exports = class BrandRepository {
  constructor() {}

  async createBrand(brand) {
    const { sql, getPool } = require("../db/MssqlDb");
    const pool = await getPool();
    const request = pool.request();
    request.input("name", sql.NVarChar, brand.getName());
    request.input("slug", sql.NVarChar, brand.getSlug());
    request.input("status", sql.Int, brand.getStatus());
    const result = await request.query(
      "INSERT INTO brands (name, slug, status) VALUES (@name, @slug,  @status); SELECT SCOPE_IDENTITY() AS id"
    );
    const brandRs = new Brand(
      result.recordset[0].id,
      brand.name,
      brand.email,
      brand.slug,
      brand.status
    );
    return brandRs;
  }
};
