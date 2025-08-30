var express = require("express");
var router = express.Router();
const CategoryController = require("../controller/category");

const categoryController = new CategoryController();

router.route("/").post(categoryController.create);
router.route("/:id").delete(categoryController.delete);

module.exports = router;
