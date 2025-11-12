const Product = require('../../models/product');

function homeController() {
    return {
        async home(req, res) {
            const subcategories = await Product.distinct("subcategory");
            const data = await Promise.all(
                subcategories.map(async (subcat) => {
                    const products = await Product.find({ subcategory: subcat });
                    return { subcategory: subcat, products };
                })
            );
            return res.render('home', { data })
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
        async wishlist(req, res) {
            const { wishlist } = req.body;
            if (req.session && req.session.user && req.session.user.wishlist && req.session.user.wishlist.length) {
                const products = await Product.find({ _id: { $in: JSON.parse(req.session.user.wishlist) } });
                return res.render('customers/wishlist', { products })
            } else if (wishlist && wishlist.length) {
                const products = await Product.find({ _id: { $in: JSON.parse(wishlist) } });
                return res.render('customers/wishlist', { products })
            } else {
                return res.render('customers/wishlist', { products: [] })
            }
        },
        async shopSingle(req, res) {
            return res.render('customers/shop-single')
        }
    }
}

module.exports = homeController