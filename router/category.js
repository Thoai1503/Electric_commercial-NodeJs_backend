var express = require("express");
var router = express.Router();
const CategoryController = require("../controller/category");

const categoryController = new CategoryController();

router.route("/").post(categoryController.create);

module.exports = router;
