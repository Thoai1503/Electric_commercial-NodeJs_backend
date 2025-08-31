const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports = class User {
  id = 0;
  name = "";
  email = "";
  phone = "";
  password = "";
  role = 0;
  status = 0;
  static USER_TABLE = "users";
  static ID_COLUMN = "id";
  static NAME_COLUMN = "name";
  static EMAIL_COLUMN = "email";
  static PHONE_COLUMN = "phone";
  static PASSWORD_COLUMN = "password";
  static ROLE_COLUMN = "role";
  static STATUS_COLUMN = "status";
  constructor(id, name, email, phone, password, role, status) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.role = role;
    this.status = status;
  }

  getId() {
    return this.id;
  }
  setId(id) {
    this.id = id;
  }
  getName() {
    return this.name;
  }
  setName(name) {
    this.name = name;
  }
  getEmail() {
    return this.email;
  }
  setEmail(email) {
    this.email = email;
  }
  getPhone() {
    return this.phone;
  }
  setPhone(phone) {
    this.phone = phone;
  }
  getPassword() {
    return this.password;
  }
  setPassword(password) {
    this.password = password;
  }
  getRole() {
    return this.role;
  }
  setRole(role) {
    this.role = role;
  }
  getStatus() {
    return this.status;
  }
  setStatus(status) {
    this.status = status;
  }

  async hashPassword() {
    const passwordService = require('../service/passwordService');
    this.password = await passwordService.hashPassword(this.password);
  }
  
  async comparePassword(password) {
    const passwordService = require('../service/passwordService');
    return await passwordService.comparePassword(password, this.password.trim());
  }

  generateAuthToken() {
    const jwtService = require('../service/jwtService');
    const payload = {
      id: this.id,
      email: this.email,
      role: this.role,
      status: this.status
    };
    
    const tokens = jwtService.generateTokens(payload);
    return tokens;
  }
  static getUserTable() {
    return this.USER_TABLE;
  }
};
