const slugify = require("slugify");
const Category = require("../model/Category");

const CategoryService = require("../service/category");
module.exports = class CategoryController {
  categoryService = null;
  constructor() {
    this.categoryService = new CategoryService();
  }
  create = async (req, res, next) => {
    const { name, parent_id } = req.body;
    const category = new Category(0, name, parent_id);
    const result = await this.categoryService.createCategory(category);
    return res.json(result);
  };
  delete = async (req, res, next) => {
    const { id } = req.params;
    console.log("Deleted id:" + id);
    const result = await this.categoryService.deleteCategory(id);
    res.json(result);
  };
};
