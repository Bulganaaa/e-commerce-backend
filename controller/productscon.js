const Product = require('../models/productsmod');
const myError = require('../utils/myError');
const asyncHandler = require('../middleware/asyncHandler');

exports.getProducts = asyncHandler(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).send({
        success: true,
        data: products,
    });
});

exports.getProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.prodid);
    if (!product) {
        return next(new myError("Sorry this product doesn't exist", 400));
    }
    res.status(200).send({
        success: true,
        data: product,
    });
});

exports.createProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.create(req.body);
    res.status(201).send({
        success: true,
        data: product,
    });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(req.params.prodid, req.body, {
        new: true,
        runValidators: true
    });
    if (!product) {
        return next(new myError("Sorry this product doesn't exist", 400));
    }
    res.status(200).send({
        success: true,
        data: product,
    });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.prodid);
    if (!product) {
        return next(new myError("Sorry this product doesn't exist", 400));
    }
    res.status(200).send({
        success: true,
        data: product,
    });
});