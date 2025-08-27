module.exports = class Category {
  id = 0;
  name = "";
  parent_id = "";
  path = "";
  level = 0;
  slug = "";

  constructor(id, name, parent_id = 0, path = "", level = 0, slug = "") {
    this.id = id;
    this.name = name;
    this.slug = slug;
    this.parent_id = parent_id;
    this.path = path;
    this.level = level;
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
  getParentId() {
    return this.parent_id;
  }
  setParentId(parent_id) {
    this.parent_id = parent_id;
  }
  getPath() {
    return this.path;
  }
  setPath(path) {
    this.path = path;
  }
};
