const express = require('express');

const {getProduct, createProduct, getProducts, updateProduct, deleteProduct} = require('../controller/productscon');

const router = express.Router();

router.route('/').get(getProducts).post(createProduct);
router.route('/:proid').get(getProduct).put(updateProduct).delete(deleteProduct);

module.exports = router;