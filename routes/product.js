const express = require("express");
const {
  productsAll,
  productsDetails,
  createProduct,
  deleteProduct,
  updateProduct,
  createReview,
  adminProducts,
} = require("../controllers/products.js");

const router = express.Router();

router.get("/products", productsAll);
router.get("/admin/products", adminProducts);
router.get("/products/:id", productsDetails);
router.post("/product/new", createProduct);
router.post("/product/newReview", createReview);
router.delete("/products/:id", deleteProduct);
router.put("/products/:id", updateProduct);

module.exports = router;
