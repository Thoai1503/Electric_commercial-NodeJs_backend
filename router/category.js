var express = require("express");
var router = express.Router();
const CategoryController = require("../controller/category");

const categoryController = new CategoryController();
const authMiddleware = require("../middleware/checkToken");

router.route("/").post(categoryController.create);
router
  .route("/:id")
  .put(categoryController.update)
  .delete(categoryController.delete);

module.exports = router;
