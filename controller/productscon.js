const Product = require('../models/productsmod');
const myError = require('../utils/myError');
const asyncHandler = require('../middleware/asyncHandler');

//api/v1/products
//api/v1/categories/:catid/products
exports.getProducts = asyncHandler(async (req, res, next) => {
    let query;

    const reqQuery = { ...req.query };

    const removeFields = ['select', 'sort'];

    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);

    if (req.params.catid) {
        query = Product.find({ category: req.params.catid });
    } else {
        query = Product.find(JSON.parse(queryStr));
    }

    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    // Populate category field
    query = query.populate('category');

    const products = await query;

    res.status(200).send({
        success: true,
        count: products.length,
        data: products,
    });
});

exports.getProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.prodid).populate('category');
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
    }).populate('category');
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