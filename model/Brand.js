module.exports = class Brand {
  id = 0;
  name = "";
  slug = "";
  status = 1;
  static USER_TABLE = "brand";
  static ID_COLUMN = "id";
  static NAME_COLUMN = "name";
  static SLUG_COLUMN = "slug";
  static STATUS_COLUMN = "status";
  constructor(id, name, slug, status) {
    this.id = id;
    this.name = name;
    this.slug = slug;
    this.status = status;
  }
  getId() {
    return this.id;
  }
  setId(id) {
    this.id = id;
  }
  getName() {
    return this.name;
  }
  setName(name) {
    this.name = name;
  }
  getSlug() {
    return this.slug;
  }
  setSlug(slug) {
    this.slug = slug;
  }
  getStatus() {
    return this.status;
  }
  setStatus(status) {
    this.status = status;
  }
};
