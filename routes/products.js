const express = require('express');
const { getProduct, createProduct, getProducts, updateProduct, deleteProduct } = require('../controller/productscon');

const router = express.Router();

// Correct the route path
router.route('/')
    .get(getProducts)
    .post(createProduct);

router.route('/:prodid')
    .get(getProduct)
    .put(updateProduct)
    .delete(deleteProduct);

module.exports = router;