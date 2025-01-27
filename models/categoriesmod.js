const mongoose = require('mongoose');
const slugify = require('slugify');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Insert the name of Category"],
        unique: true,
        trim: true,
        maxlength: [40, '40 temdegees hetrehgui']
    },
    slug: {
        type: String,
        unique: true
    },
    photo: {
        type: String,
        default: 'no-photo.jpg',
    },
});

// Create category slug from the name
CategorySchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

module.exports = mongoose.model("Category", CategorySchema);