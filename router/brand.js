var express = require("express");
var router = express.Router();

const BrandController = require("../controller/brand");

const BrandRepository = require("../repository/brand");

const brandRepository = new BrandRepository();
const brandController = new BrandController(brandRepository);

router.route("/").post(brandController.createBrand);
//router.post("/", brandController.createBrand);

module.exports = router;
