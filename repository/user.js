const User = require("../model/User");

module.exports = class UserRepository {
  constructor() {}
  async getAllUsers() {
    const { sql, getPool } = require("../db/MssqlDb");
    const pool = await getPool();
    const request = pool.request();
    const result = await request.query("SELECT * FROM users");
    return result.recordset;
  }
  async getUserByEmail(email) {
    const { sql, getPool } = require("../db/MssqlDb");
    const pool = await getPool();
    const request = pool.request();
    request.input("email", sql.NVarChar, email);
    const result = await request.query(
      "SELECT * FROM users WHERE email = @email"
    );
    if (result.recordset.length > 0) {
      const user = result.recordset[0];

      return new User(
        user.id,
        user.name,
        user.email,
        user.phone,
        user.password,
        user.role,
        user.status
      );
    }

    return null;
  }
  async getUserById(id) {
    const { sql, getPool } = require("../db/MssqlDb");
    const pool = await getPool();
    const request = pool.request();
    request.input("id", sql.Int, id);
    const result = await request.query("SELECT * FROM users WHERE id = @id");
    return result.recordset[0];
  }
  async createUser(user) {
    const { sql, getPool } = require("../db/MssqlDb");
    const pool = await getPool();
    const request = pool.request();
    request.input("name", sql.NVarChar, user.getName());
    request.input("email", sql.NVarChar, user.getEmail());
    request.input("phone", sql.NVarChar, user.getPhone());
    request.input("password", sql.NVarChar, user.getPassword());
    request.input("role", sql.Int, user.getRole());
    request.input("status", sql.Int, user.getStatus());
    const result = await request.query(
      "INSERT INTO users (full_name, email, phone, password, role, status) VALUES (@name, @email, @phone, @password, @role, @status); SELECT SCOPE_IDENTITY() AS id"
    );

    const userRs = new User(
      result.recordset[0].id,
      user.name,
      user.email,
      user.phone,
      user.password,
      user.role,
      user.status
    );
    return userRs;
  }
  async updateUser(id, user) {
    const { sql, getPool } = require("../db/MssqlDb");
    const pool = await getPool();
    const request = pool.request();
    request.input("id", sql.Int, id);
    request.input("name", sql.NVarChar, user.name);
    request.input("email", sql.NVarChar, user.email);
    request.input("phone", sql.NVarChar, user.phone);
    request.input("password", sql.NVarChar, user.password);
    request.input("role", sql.Int, user.role);
    request.input("status", sql.Int, user.status);
    await request.query(
      "UPDATE users SET name = @name, email = @email, phone = @phone, password = @password, role = @role, status = @status WHERE id = @id"
    );
    return { id };
  }
};
