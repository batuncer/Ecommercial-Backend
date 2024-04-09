const express = require("express");
const {
  productsAll,
  productsDetails,
  createProduct,
  deleteProduct,
  updateProduct,
  createReview,
  adminProducts,
} = require("../controllers/product.js");
const { authenticationMid, roleCheck } = require("../middleware/auth.js");

const router = express.Router();

router.get("/products", productsAll);
router.get(
  "/admin/products",
  authenticationMid,
  roleCheck("admin"),
  adminProducts
);
router.get("/products/:id", productsDetails);
router.post(
  "/product/new",
  authenticationMid,
  roleCheck("admin"),
  createProduct
);
router.post("/product/newReview", authenticationMid, createReview);
router.delete(
  "/products/:id",
  authenticationMid,
  roleCheck("admin"),
  deleteProduct
);
router.put(
  "/products/:id",
  authenticationMid,
  roleCheck("admin"),
  updateProduct
);

module.exports = router;
