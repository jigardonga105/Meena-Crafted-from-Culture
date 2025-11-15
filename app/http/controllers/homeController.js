const Product = require('../../models/product');
const User = require('../../models/user');

function arraysHaveSameItems(a, b) {
    if (a.length !== b.length) return false;

    return a.sort().toString() === b.sort().toString();
}

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
            return res.render('customers/wishlist', { products: [] })
        },
        async requestWishlist(req, res) {
            const { wishlist } = req.body;

            if (req.body.wishlistClear) {
                await User.updateOne({ _id: req.session.user._id }, { $set: { wishlist: [] } })
                req.session.user.wishlist = []

                return res.render('customers/wishlist', { products: [] })
            }

            if (req.session && req.session.user && req.session.user.wishlist && req.session.user.wishlist.length) {
                if (arraysHaveSameItems(req.session.user.wishlist, wishlist)) {
                    const products = await Product.find({ _id: { $in: req.session.user.wishlist } });
                    return res.render('customers/wishlist', { products })
                } else {
                    await User.updateOne({ _id: req.session.user._id }, { $set: { wishlist: JSON.parse(wishlist) } })
                    const products = await Product.find({ _id: { $in: JSON.parse(wishlist) } });
                    return res.render('customers/wishlist', { products })
                }
            } else if (wishlist && wishlist.length) {
                const products = await Product.find({ _id: { $in: JSON.parse(wishlist) } });
                return res.render('customers/wishlist', { products })
            } else {
                return res.render('customers/wishlist', { products: [] })
            }
        },
        async addToWishlist(req, res) {
            const { wishlist, removeFromWishlist } = req.body
            if (wishlist.length > 0) {
                const resultNew = await User.updateOne({ _id: req.session.user._id }, { $set: { wishlist } })
                if (resultNew) {
                    const userNew = await User.findById({ _id: req.session.user._id })
                    delete req.session.user
                    req.session.user = userNew

                    if (removeFromWishlist == true) {
                        return res.json({ type: "success", message: 'Item removed from Wishlist' })
                    }
                    return res.json({ type: "success", message: 'Item added to Wishlist' })
                } else {
                    req.flash('error', 'Something went wrong...')
                    return res.json({ type: "error", message: 'Something went wrong...' })
                }
            }
        },
        async shopSingle(req, res) {
            return res.render('customers/shop-single')
        }
    }
}

module.exports = homeController