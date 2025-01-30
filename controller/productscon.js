const Product = require("../models/productsmod");
const path = require("path");
const Category = require("../models/categoriesmod");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");
const User = require("../models/usersmod");

// api/v1/products
exports.getProducts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, Product);

  const products = await Product.find(req.query, select)
    .populate({
      path: "category",
      select: "name averagePrice",
    })
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
    pagination,
  });
});

exports.getUserProducts = asyncHandler(async (req, res, next) => {
  req.query.createUser = req.userId;
  return this.getProducts(req, res, next);
});

// api/v1/categories/:catId/products
exports.getCategoryProducts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, Product);

  const products = await Product.find(
    { ...req.query, category: req.params.categoryId },
    select
  )
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
    pagination,
  });
});

exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new MyError(req.params.id + " ID-тэй бүтээгдэхүүн байхгүй байна.", 404);
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

exports.createCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.create(req.body);

  res.status(200).json({
    success: true,
    data: category,
  });
});

exports.createProduct = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.body.category);

  if (!category) {
    throw new MyError(req.body.category + " ID-тэй категори байхгүй!", 400);
  }

  req.body.createUser = req.userId;

  const product = await Product.create(req.body);

  res.status(200).json({
    success: true,
    data: product,
  });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new MyError(req.params.id + " ID-тэй бүтээгдэхүүн байхгүй байна.", 404);
  }

  if (product.createUser.toString() !== req.userId && req.userRole !== "admin") {
    throw new MyError("Та зөвхөн өөрийнхөө бүтээгдэхүүнийг л устгах эрхтэй", 403);
  }

  const user = await User.findById(req.userId);

  product.remove();

  res.status(200).json({
    success: true,
    data: product,
    whoDeleted: user.name,
  });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new MyError(req.params.id + " ID-тэй бүтээгдэхүүн байхгүй байна.", 400);
  }

  if (product.createUser.toString() !== req.userId && req.userRole !== "admin") {
    throw new MyError("Та зөвхөн өөрийнхөө бүтээгдэхүүнийг л засварлах эрхтэй", 403);
  }

  req.body.updateUser = req.userId;

  for (let attr in req.body) {
    product[attr] = req.body[attr];
  }

  product.save();

  res.status(200).json({
    success: true,
    data: product,
  });
});

// PUT:  api/v1/products/:id/photo
exports.uploadProductPhoto = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new MyError(req.params.id + " ID-тэй бүтээгдэхүүн байхгүй байна.", 400);
  }

  const file = req.files.file;

  if (!file.mimetype.startsWith("image")) {
    throw new MyError("Та зураг upload хийнэ үү.", 400);
  }

  if (file.size > process.env.MAX_UPLOAD_FILE_SIZE) {
    throw new MyError("Таны зурагны хэмжээ хэтэрсэн байна.", 400);
  }

  file.name = `photo_${req.params.id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, (err) => {
    if (err) {
      throw new MyError(
        "Файлыг хуулах явцад алдаа гарлаа. Алдаа : " + err.message,
        400
      );
    }

    product.photo = file.name;
    product.save();

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});