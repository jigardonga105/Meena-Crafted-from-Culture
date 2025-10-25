const Product = require('../../models/product');

function homeController() {
    return {
        async home(req, res) {
            const products = await Product.find();
            // console.log(products);
            return res.render('home', { products })
        },
        async about(req, res) {
            return res.render('admin/about')
        },
        async contact(req, res) {
            return res.render('customers/contact')
        },
        async shop(req, res) {
            const products = await Product.find();
            // console.log(products);
            return res.render('customers/shop', { products })
        },
        async shopSingle(req, res) {
            return res.render('customers/shop-single')
        }
    }
}

module.exports = homeController