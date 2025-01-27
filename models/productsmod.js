const mongoose = require('mongoose');
const {transliterate, slugify} = require('transliteration');
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'Category', 
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

productSchema.pre('save', function(next) {
   //name horvuuleh
    this.slug = slugify(this.name, { lower: true });
    next();
});

module.exports = mongoose.model('Product', productSchema);
