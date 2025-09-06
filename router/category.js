var express = require("express");
var router = express.Router();
const CategoryController = require("../controller/category");

const categoryController = new CategoryController();
const authMiddleware = require("../middleware/checkToken");

router
  .route("/")
  .post(authMiddleware.authenticateToken, categoryController.create);
router
  .route("/:id")
  .post(authMiddleware.authenticateToken, categoryController.update)
  .delete(categoryController.delete);

module.exports = router;
