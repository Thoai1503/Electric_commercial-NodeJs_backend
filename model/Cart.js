module.exports = class Cart {
  id = 0;
  user_id = 0;
  variant_id = 0;
  quantity = 0;
  price = 0;

  constructor(id = 0, user_id = 0, variant_id = 0, quantity = 0, price = 0) {
    this.id = id;
    this.user_id = user_id;
    this.variant_id = variant_id;
    this.quantity = quantity;
    this.price = price;
  }
  getId() {
    return this.id;
  }
  setId(id) {
    this.id = id;
  }
  getUserId() {
    return this.user_id;
  }
  setUserId(user_id) {
    this.user_id = user_id;
  }
  getVariantId() {
    return this.variant_id;
  }
  setVariantId(variant_id) {
    this.variant_id = variant_id;
  }
  getQuantity() {
    return this.quantity;
  }
  setQuantity(quantity) {
    this.quantity = quantity;
  }
  getPrice() {
    return this.price;
  }
  setPrice(price) {
    this.price = price;
  }
};
