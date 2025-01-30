const fs = require('fs');
const mongoose = require('mongoose');
const Category = require('./models/categoriesmod');
const Product = require('./models/productsmod');
const User = require('./models/usersmod');
const colors = require('colors');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected'.green.bold);
}).catch(err => {
    console.error(`Error: ${err.message}`.red);
    process.exit(1);
});

const categories = JSON.parse(
    fs.readFileSync(__dirname + '/data/categories.json', 'utf-8')
);
const products = JSON.parse(
    fs.readFileSync(__dirname + '/data/products.json', 'utf-8')
);
const users = JSON.parse(
    fs.readFileSync(__dirname + '/data/users.json', 'utf-8')
);
const importData = async () => {
    try {
        await Category.create(categories);
        await Product.create(products);
        await User.create(users);
        console.log('Data successfully imported'.cyan);
        process.exit();
    } catch (err) {
        console.error(err.message.red);
        process.exit(1);
    }
};

const deleteData = async () => {
    try {
        await Category.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        console.log('All data successfully deleted'.yellow.inverse.bold);
        process.exit();
    } catch (err) {
        console.error(err.message.red);
        process.exit(1);
    }
};

if (process.argv[2] === 'imp') {
    importData();
} else if (process.argv[2] === 'del') {
    deleteData();
} else {
    console.log('Invalid command. Use "imp" to import data or "del" to delete data.'.red);
    process.exit(1);
}