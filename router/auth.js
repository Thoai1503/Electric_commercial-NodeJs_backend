var express = require("express");
var router = express.Router();

const AuthController = require("../controller/auth");
const UserRepository = require("../repository/user");

const userRepository = new UserRepository();
const authController = new AuthController(userRepository);

router.post("/login", authController.login);
router.post("/register", authController.register);

module.exports = router;
