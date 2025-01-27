const mongoose = require('mongoose');
const { transliterate, slugify } = require('transliteration');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name for the product"],
        trim: true,
        maxlength: [100, "Name cannot be more than 100 characters"]
    },
    description: {
        type: String,
        required: [true, "Please add a description for the product"]
    },
    price: {
        type: Number,
        required: [true, "Please add a price for the product"],
        min: 0
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: true
    },
    sizes: {
        type: [String],
        required: true,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    },
    colors: {
        type: [String],
        required: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    images: {
        type: [String] // Array of image URLs
    },
    brand: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviews: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            comment: String,
            rating: { type: Number, min: 0, max: 5 }
        }
    ],
    isFeatured: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, 

{ timestamps: true });



module.exports = mongoose.model('Product', ProductSchema);