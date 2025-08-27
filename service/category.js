const axios = require("axios");

module.exports = class CategoryService {
  endPoint = process.env.CATALOG_API_ENDPOINT;
  constructor() {}
  createCategory = async (cate) => {
    try {
      const result = await axios.post(this.endPoint + "api/category", cate, {
        headers: { "Content-Type": "application/json" },
      });
      return result.data;
    } catch (error) {
      console.log("Error :" + error.message);
      return false;
    }
  };
};
