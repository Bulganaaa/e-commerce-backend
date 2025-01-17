const mongoose=require('mongoose');

const CategorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Insert the name of Category"],
        unique: true,
        trim: true,
        maxlength:[40, '40 temdegees hetrehgui']
    },
    photo:{
        type:String,
        default: 'no-photo.jpg',
    },
});

module.exports = mongoose.model("Category", CategorySchema);