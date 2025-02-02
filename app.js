const express = require("express");
const dotenv = require("dotenv");
var path = require("path");
var rfs = require("rotating-file-stream");
const colors = require("colors");
var morgan = require("morgan");
const logger = require("./middleware/logger");
const fileupload = require("express-fileupload");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

// Router оруулж ирэх
const categoriesRoutes = require("./routes/categories");
const productsRoutes = require("./routes/products");
const usersRoutes = require("./routes/users");
const commentsRoutes = require("./routes/comments");
const injectDb = require("./middleware/injectDb");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

// Аппын тохиргоог process.env рүү ачаалах
dotenv.config({ path: "./config/config.env" });

// Mysql тэй ажиллах обьект
const db = require("./config/db-mysql");

// Express апп үүсгэх
const app = express();

// MongoDB өгөгдлийн сантай холбогдох
connectDB();

// Манай рест апиг дуудах эрхтэй сайтуудын жагсаалт :
var whitelist = ["http://localhost:3000"];

// Өөр домэйн дээр байрлах клиент вэб аппуудаас шаардах шаардлагуудыг энд тодорхойлно
var corsOptions = {
  // Ямар ямар домэйнээс манай рест апиг дуудаж болохыг заана
  origin: function (origin, callback) {
    if (origin === undefined || whitelist.indexOf(origin) !== -1) {
      // Энэ домэйнээс манай рест рүү хандахыг зөвшөөрнө
      callback(null, true);
    } else {
      // Энэ домэйнд хандахыг хориглоно.
      callback(new Error("Horigloj baina.."));
    }
  },
  // Клиент талаас эдгээр http header-үүдийг бичиж илгээхийг зөвшөөрнө
  allowedHeaders: "Authorization, Set-Cookie, Content-Type",
  // Клиент талаас эдгээр мэссэжүүдийг илгээхийг зөвөөрнө
  methods: "GET, POST, PUT, DELETE",
  // Клиент тал authorization юмуу cookie мэдээллүүдээ илгээхийг зөвшөөрнө
  credentials: true,
};


// Express rate limit : Дуудалтын тоог хязгаарлана
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 100 requests per windowMs
  message: "15 минутанд 3 удаа л хандаж болно! ",
});
app.use(limiter);
// http parameter pollution халдлагын эсрэг products?name=aaa&name=bbb  ---> name="bbb"
app.use(hpp());
// Cookie байвал req.cookie рүү оруулж өгнө0
app.use(cookieParser());
//логгер
app.use(logger);
// Body дахь өгөгдлийг Json болгож өгнө
app.use(express.json());
// Өөр өөр домэйнтэй вэб аппуудад хандах боломж өгнө
app.use(cors(corsOptions));
// Клиент вэб аппуудыг мөрдөх ёстой нууцлал хамгаалалтыг http header ашиглан зааж өгнө
app.use(helmet());
// клиент сайтаас ирэх Cross site scripting халдлагаас хамгаална
app.use(xss());
// Клиент сайтаас дамжуулж буй MongoDB өгөгдлүүдийг халдлагаас цэвэрлэнэ
app.use(mongoSanitize());
// Сэрвэр рүү upload хийсэн файлтай ажиллана
app.use(fileupload());
// req.db рүү mysql db болон sequelize моделиудыг оруулна
app.use(injectDb(db));

// Morgan logger-ийн тохиргоо
var accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "log"),
});
app.use(morgan("combined", { stream: accessLogStream }));

// REST API RESOURSE
app.use("/api/v1/categories", categoriesRoutes);
app.use("/api/v1/products", productsRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/comments", commentsRoutes);

// Алдаа үүсэхэд барьж авч алдааны мэдээллийг клиент тал руу автоматаар мэдээлнэ
app.use(errorHandler);

// Sequelize моделиудын холбоог зааж өгнө.
// Ингэснээр db.user.getProducts г.м-ээр дуудаж ажиллах боломжтой болно
db.user.belongsToMany(db.product, { through: db.comment });
db.product.belongsToMany(db.user, { through: db.comment });
db.user.hasMany(db.comment);
db.comment.belongsTo(db.user);
db.product.hasMany(db.comment);
db.comment.belongsTo(db.product);
db.category.hasMany(db.product);
db.product.belongsTo(db.category);

// Моделиудаас базыг үүсгэнэ (хэрэв үүсээгүй бол)
db.sequelize
  .sync()
  .then((result) => {
    console.log("sync hiigdlee...");
  })
  .catch((err) => console.log(err));

// express сэрвэрийг асаана.
const server = app.listen(
  process.env.PORT,
  console.log(`Express сэрвэр ${process.env.PORT} порт дээр аслаа... `.green.bold.inverse)
);

// Баригдалгүй цацагдсан бүх алдаануудыг энд барьж авна
process.on("unhandledRejection", (err, promise) => {
  console.log(`Алдаа гарлаа : ${err.message}`.underline.red.bold);
  server.close(() => {
    process.exit(1);
  });
});