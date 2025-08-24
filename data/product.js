const categories = [
  { name: "Laptop" },
  { name: "PC Gaming" },
  { name: "Màn hình" },
  { name: "Chuột" },
  { name: "Bàn phím" },
];

// Products kèm CategoryId (index trong mảng categories + 1 vì identity bắt đầu từ 1)
const products = [
  {
    name: "Laptop Dell Inspiron 15",
    brand: "Dell",
    ram: "8GB",
    price: 14500000,
    categoryId: 1,
  },
  {
    name: "Laptop Asus Vivobook",
    brand: "Asus",
    ram: "8GB",
    price: 13500000,
    categoryId: 1,
  },
  {
    name: "Laptop HP Pavilion 14",
    brand: "HP",
    ram: "8GB",
    price: 15000000,
    categoryId: 1,
  },
  {
    name: "Laptop Apple MacBook Air M1",
    brand: "Apple",
    ram: "8GB",
    price: 25000000,
    categoryId: 1,
  },
  {
    name: "PC Gaming MSI Trident 3",
    brand: "MSI",
    ram: "16GB",
    price: 22000000,
    categoryId: 2,
  },
  {
    name: "PC Gaming Asus ROG Strix",
    brand: "Asus",
    ram: "32GB",
    price: 38000000,
    categoryId: 2,
  },
  {
    name: 'Màn hình Dell Ultrasharp 27"',
    brand: "Dell",
    ram: null,
    price: 8000000,
    categoryId: 3,
  },
  {
    name: 'Màn hình LG 24" FullHD',
    brand: "LG",
    ram: null,
    price: 3500000,
    categoryId: 3,
  },
  {
    name: "Chuột Logitech G Pro X",
    brand: "Logitech",
    ram: null,
    price: 1200000,
    categoryId: 4,
  },
  {
    name: "Bàn phím cơ Keychron K2",
    brand: "Keychron",
    ram: null,
    price: 2500000,
    categoryId: 5,
  },
];
