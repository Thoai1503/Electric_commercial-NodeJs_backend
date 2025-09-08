var express = require("express");
var router = express.Router();

const AuthController = require("../controller/auth");
const UserRepository = require("../repository/user");
const authMiddleware = require("../middleware/checkToken");

const userRepository = new UserRepository();
const authController = new AuthController(userRepository);

// Public routes
router.post("/login", authMiddleware.logAuthAttempt, authController.login);
router.post(
  "/register",
  authMiddleware.logAuthAttempt,
  authController.register
);
router.post(
  "/refresh_token",
  authMiddleware.validateRefreshToken,
  authController.refreshToken
);

// Protected routes
router.post("/logout", authMiddleware.authenticateToken, authController.logout);
router.get(
  "/profile",
  authMiddleware.authenticateToken,
  authController.getProfile
);

module.exports = router;
