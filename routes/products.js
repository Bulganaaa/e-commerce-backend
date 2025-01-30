const express = require("express");
const { protect, authorize } = require("../middleware/protect");

const {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  uploadProductPhoto,
} = require("../controller/productscon");

const { getProductComments } = require("../controller/commentscon");

const router = express.Router();

// "/api/v1/products"
router
  .route("/")
  .get(getProducts)
  .post(protect, authorize("admin", "operator"), createProduct);

router
  .route("/:id")
  .get(getProduct)
  .put(protect, authorize("admin", "operator"), updateProduct)
  .delete(protect, authorize("admin", "operator"), deleteProduct);

router
  .route("/:id/photo")
  .put(protect, authorize("admin", "operator"), uploadProductPhoto);

router
  .route("/:id/comments")
  .get(getProductComments);

module.exports = router;