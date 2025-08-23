var express = require("express");
var router = express.Router();

const UserController = require("../controller/user");
const UserRepository = require("../repository/user");

const userRepository = new UserRepository();
const userController = new UserController(userRepository);

router.get("/getAll", userController.getAllUser);

module.exports = router;
