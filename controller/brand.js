const Brand = require("../model/Brand");
module.exports = class BrandController {
  brandRepository = null;
  constructor(brandRepository) {
    this.brandRepository = brandRepository;
  }
  createBrand = async (req, res, next) => {
    const { name, slug } = req.body;
    const status = 1;
    const newBrand = new Brand(0, name, slug, status);
    try {
      const data = await this.brandRepository.createBrand(newBrand);
      console.log("1." + JSON.stringify(data));
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
};
