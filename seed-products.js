/* ==========================================================
   المنتجات — عدّل من هنا
   ملاحظة: البيانات تجريبية. الأسعار والمخزون والصور ليست نهائية.
   ========================================================== */
const LOCAL_PRODUCTS = [
  {
    id: "hoodie-black-001",
    name: "Onefournine Hoodie · أسود",
    description: "هودي أسود بتصميم عصري وخامة مريحة.",
    image: "hoodie-black-front.jpg",
    images: ["hoodie-black-front.jpg", "hoodie-black-back.jpg"],
    price: 950,
    discountPrice: 599,               // null = بدون خصم
    colors: [{ name: "أسود", value: "#08080A" }],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 20,
    featured: true,
    unavailableColors: [],
    unavailableSizes: []
  },
  {
    id: "hoodie-gray-001",
    name: "Onefournine Hoodie · رمادي",
    description: "هودي رمادي بخامة ناعمة وقصّة نظيفة.",
    image: "hoodie-gray-front.jpg",
    images: ["hoodie-gray-front.jpg", "hoodie-gray-back.jpg"],
    price: 950,
    discountPrice: 599,
    colors: [{ name: "رمادي", value: "#9A9EA0" }],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 20,
    featured: false,
    unavailableColors: [],
    unavailableSizes: []
  },
  {
    id: "hoodie-navy-001",
    name: "Onefournine Hoodie · VIP رمادي",
    description: "هودي رمادي VIP بجودة عالية وصناعة ممتازة.",
    image: "hoodie-vip-gray-front.jpg",
    images: ["hoodie-vip-gray-front.jpg", "hoodie-vip-gray-back.jpg"],
    price: 1050,
    discountPrice: 799,
    colors: [{ name: "رمادي VIP", value: "#9A9EA0" }],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 20,
    featured: false,
    unavailableColors: [],
    unavailableSizes: []
  },
  {
    id: "hoodie-beige-001",
    name: "Onefournine Hoodie · VIP أسود",
    description: "هودي أسود VIP بخامة ممتازة وجودة عالمية.",
    image: "hoodie-black-vip-front.jpg",
    images: ["hoodie-black-vip-front.jpg", "hoodie-black-vip-back.jpg"],
    price: 1050,
    discountPrice: 799,
    colors: [{ name: "أسود VIP", value: "#08080A" }],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 20,
    featured: false,
    unavailableColors: [],
    unavailableSizes: []
  }
];
