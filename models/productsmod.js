const mongoose = require("mongoose");
const { transliterate, slugify } = require("transliteration");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Бүтээгдэхүүний нэрийг оруулна уу"],
      unique: true,
      trim: true,
      maxlength: [250, "Бүтээгдэхүүний нэрний урт дээд тал нь 250 тэмдэгт байх ёстой."],
    },
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    brand: {
      type: String,
      required: [true, "Брэндийн нэрийг оруулна уу"],
      trim: true,
      maxlength: [
        50,
        "Брэндийн нэрний урт дээд тал нь 50 тэмдэгт байх ёстой.",
      ],
    },
    averageRating: {
      type: Number,
      min: [1, "Рэйтинг хамгийн багадаа 1 байх ёстой"],
      max: [10, "Рэйтинг хамгийн ихдээ 10 байх ёстой"],
    },
    price: {
      type: Number,
      required: [true, "Бүтээгдэхүүний үнийг оруулна уу"],
      min: [500, "Бүтээгдэхүүний үнэ хамгийн багадаа 500 төгрөг байх ёстой"],
    },
    stock: Number,
    description: {
      type: String,
      required: [true, "Бүтээгдэхүүний тайлбарыг оруулна уу"],
      trim: true,
      maxlength: [5000, "Бүтээгдэхүүний тайлбарын урт дээд тал нь 5000 тэмдэгт байх ёстой."],
    },
    bestseller: {
      type: Boolean,
      default: false,
    },
    availableSizes: [String],

    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: true,
    },

    createUser: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },

    updateUser: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ProductSchema.statics.computeCategoryAveragePrice = async function (catId) {
  const obj = await this.aggregate([
    { $match: { category: catId } },
    { $group: { _id: "$category", avgPrice: { $avg: "$price" } } },
  ]);

  console.log(obj);
  let avgPrice = null;

  if (obj.length > 0) avgPrice = obj[0].avgPrice;

  await this.model("Category").findByIdAndUpdate(catId, {
    averagePrice: avgPrice,
  });

  return obj;
};

ProductSchema.post("save", function () {
  this.constructor.computeCategoryAveragePrice(this.category);
});

ProductSchema.post("remove", function () {
  this.constructor.computeCategoryAveragePrice(this.category);
});

module.exports = mongoose.model("Product", ProductSchema);