const User = require("../model/User");
const passwordService = require("../service/passwordService");

module.exports = class AuthController {
  userRepository = null;
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
      // Input validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
          code: "MISSING_CREDENTIALS",
        });
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
          code: "INVALID_EMAIL",
        });
      }

      const user = await this.userRepository.getUserByEmail(email);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
          code: "INVALID_CREDENTIALS",
        });
      }

      // Check if account is active
      if (user.getStatus() !== 1) {
        return res.status(401).json({
          success: false,
          message: "Account is not active",
          code: "ACCOUNT_INACTIVE",
        });
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
          code: "INVALID_CREDENTIALS",
        });
      }

      this.sendTokenResponse(user, 200, res);
    } catch (error) {
      console.error("Login error:", error);
      next(error);
    }
  };

  register = async (req, res, next) => {
    const { name, email, phone, password } = req.body;

    try {
      // Input validation
      if (!name || !email || !phone || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
          code: "MISSING_FIELDS",
        });
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
          code: "INVALID_EMAIL",
        });
      }

      // Phone format validation
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({
          success: false,
          message: "Invalid phone number format",
          code: "INVALID_PHONE",
        });
      }

      // Password validation
      const passwordValidation = passwordService.validatePassword(password);
      if (!passwordValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: "Password does not meet requirements",
          errors: passwordValidation.errors,
          code: "WEAK_PASSWORD",
        });
      }

      // Check if user already exists
      const existingUser = await this.userRepository.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "User with this email already exists",
          code: "USER_EXISTS",
        });
      }

      // Create new user
      const newUser = new User(0, name, email, phone, password, 2, 1);
      await newUser.hashPassword(); // Hash password before saving
      newUser.setStatus(1); // Set default status to active

      const createdUser = await this.userRepository.createUser(newUser);
      this.sendTokenResponse(createdUser, 201, res);
    } catch (error) {
      console.error("Registration error:", error);
      next(error);
    }
  };
  sendTokenResponse = (user, statusCode, res) => {
    const tokens = user.generateAuthToken();

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only secure in production
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    };

    // Debug logging
    console.log("Generated tokens:", {
      accessToken: tokens.accessToken ? "EXISTS" : "MISSING",
      refreshToken: tokens.refreshToken ? "EXISTS" : "MISSING",
      expiresIn: tokens.expiresIn,
    });

    res
      .status(statusCode)
      .cookie("accessToken", tokens.accessToken, cookieOptions)
      .cookie("refreshToken", tokens.refreshToken, {
        ...cookieOptions,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      })
      .json({
        success: true,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      });
  };

  // Refresh token endpoint
  refreshToken = async (req, res, next) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: "Refresh token is required",
          code: "MISSING_REFRESH_TOKEN",
        });
      }

      const jwtService = require("../service/jwtService");
      const decoded = jwtService.verifyRefreshToken(refreshToken);

      // Get user from database
      const user = await this.userRepository.getUserById(decoded.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
          code: "USER_NOT_FOUND",
        });
      }

      // Generate new tokens
      const newTokens = user.generateAuthToken();

      const cookieOptions = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Only secure in production
        sameSite: "lax",
        path: "/",
      };

      res
        .status(200)
        .cookie("accessToken", newTokens.accessToken, cookieOptions)
        .cookie("refreshToken", newTokens.refreshToken, {
          ...cookieOptions,
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        })
        .json({
          success: true,

          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,

          accessToken: newTokens.accessToken,
          refreshToken: newTokens.refreshToken,
          expiresIn: newTokens.expiresIn,
        });
    } catch (error) {
      console.error("Token refresh error:", error);
      next(error);
    }
  };

  // Logout endpoint
  logout = async (req, res, next) => {
    try {
      res
        .status(200)
        .clearCookie("accessToken", { path: "/" })
        .clearCookie("refreshToken", { path: "/" })
        .json({
          success: true,
          message: "Successfully logged out",
        });
    } catch (error) {
      console.error("Logout error:", error);
      next(error);
    }
  };

  // Get current user profile
  getProfile = async (req, res, next) => {
    try {
      const user = await this.userRepository.getUserById(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
          code: "USER_NOT_FOUND",
        });
      }

      res.status(200).json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status,
        },
      });
    } catch (error) {
      console.error("Get profile error:", error);
      next(error);
    }
  };
};
1;
