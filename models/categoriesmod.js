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


CategorySchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

CategorySchema.pre('remove',  async function(next) {
   console.log('removing...');
    await this.model('Product').deleteMany({category : this.id});
    next();

});

module.exports = mongoose.model("Category", CategorySchema);