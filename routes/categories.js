const express = require('express');

const {getCategories, getCategory, updateCategory, createCategory, deleteCategory,} = require('../controller/categoriescon');

const router = express.Router();

router.route('/').get(getCategories).post(createCategory);
router.route('/:catid').get(getCategory).put(updateCategory).delete(deleteCategory);

module.exports = router;