const Category = require('../models/categoriesmod');
const myError = require('../utils/myError');
const asyncHandler = require('../middleware/asyncHandler');

exports.getCategories = asyncHandler(async (req, res, next) => {
    const categories = await Category.find();
    res.status(200).send({
        success: true,
        data: categories,
    });
});

exports.getCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.catid);
    if (!category) {
        return next(new myError("Sorry this category doesn't exist", 400));
    }
    res.status(200).send({
        success: true,
        data: category,
    });
});

exports.createCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.create(req.body);
    res.status(201).send({
        success: true,
        data: category,
    });
});

exports.updateCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findByIdAndUpdate(req.params.catid, req.body, {
        new: true,
        runValidators: true
    });
    if (!category) {
        return next(new myError("Sorry this category doesn't exist", 400));
    }
    res.status(200).send({
        success: true,
        data: category,
    });
});

exports.deleteCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findByIdAndDelete(req.params.catid);
    if (!category) {
        return next(new myError("Sorry this category doesn't exist", 400));
    }
    res.status(200).send({
        success: true,
        data: category,
    });
});