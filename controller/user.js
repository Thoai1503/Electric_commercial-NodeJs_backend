module.exports = class UserController {
  userRepository = null;
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  getAllUser = async (req, res, next) => {
    try {
      const data = await this.userRepository.getAllUsers();
      console.log("1." + JSON.stringify(data));
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
};
