const User = require("../model/User");

module.exports = class AuthController {
  userRepository = null;
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = await this.userRepository.getUserByEmail(email);
      console.log("password:", user.getPassword().trim());

      if (!user || !(await user.comparePassword(password))) {
        return res
          .status(404)
          .json({ message: "Invalid credentials", success: false });
      }

      this.sendTokenResponse(user, 200, res);
    } catch (error) {
      next(error);
    }
  };

  register = async (req, res, next) => {
    const { name, email, phone, password } = req.body;
    try {
      const existingUser = await this.userRepository.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      const newUser = new User(0, name, email, phone, password, 2, 1);
      await newUser.hashPassword(); // Ensure password is hashed before saving
      newUser.setStatus(1); // Set default status to active

      const createdUser = await this.userRepository.createUser(newUser);
      this.sendTokenResponse(createdUser, 201, res);
    } catch (error) {
      next(error);
    }
  };

  sendTokenResponse = (user, statusCode, res) => {
    const token = user.generateAuthToken();
    res
      .status(statusCode)
      .cookie("tooken", token)

      .json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  };
};
1;
