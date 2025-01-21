const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ['Men', 'Women', 'Kids', 'Accessories'], // Example categories
    },
    sizes: {
      type: [String],
      required: true,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    },
    colors: {
      type: [String],
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    images: {
      type: [String], // Array of image URLs
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        comment: String,
        rating: { type: Number, min: 0, max: 5 },
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

module.exports = mongoose.model('Product', productSchema);
