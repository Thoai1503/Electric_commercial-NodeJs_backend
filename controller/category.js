const slugify = require("slugify");
const Category = require("../model/Category");

const CategoryService = require("../service/category");
module.exports = class CategoryController {
  categoryService = null;
  constructor() {
    this.categoryService = new CategoryService();
  }
  create = async (req, res, next) => {
    try {
      const { name, parent_id } = req.body;

      // validate đơn giản
      if (!name) {
        return res
          .status(400)
          .json({ success: false, message: "Name is required" });
      }

      const category = new Category(0, name, parent_id);
      const result = await this.categoryService.createCategory(category);

      return res.status(201).json({
        success: true,
        data: result, // có thể là object category vừa tạo
      });
    } catch (error) {
      console.error("Error creating category:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  };
  update = async (req, res, next) => {
    const { name, parent_id } = req.body;
    const id = parseInt(req.params.id, 10);
    const category = new Category(id, name, parent_id);
    var result = await this.categoryService.updateCategory(category);
    if (!result) {
      return res.status(404).json({
        success: result,
        message: "Can't update or not found the result",
      });
    }
    return res.status(201).json({
      success: true,
      message: "Update successfully!",
    });
  };

  delete = async (req, res, next) => {
    const { id } = req.params;
    console.log("Deleted id:" + id);
    const result = await this.categoryService.deleteCategory(id);
    res.json(result);
  };
};
