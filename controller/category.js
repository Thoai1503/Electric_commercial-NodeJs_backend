const slugify = require("slugify");
const Category = require("../model/Category");
const CategoryService = require("../service/category");
module.exports = class CategoryController {
  categoryService = null;
  constructor() {
    this.categoryService = new CategoryService();
  }
  create = async (req, res, next) => {
    const { name, parent_id, path } = req.body;
    const slugResult = slugify(name);
    const category = new Category(0, name, parent_id);
    // req.category = category;

    const result = await this.categoryService.createCategory(category);
    return res.json(result);
  };
};
