const Product = require('../../../app/models/product');
const Store = require('../../../app/models/store');
const Comments = require('../../../app/models/comments');
const Orders = require('../../../app/models/order');
const Users = require('../../../app/models/user');

const viewProdFunc = async (req, res) => {
    const product = await Product.find({ _id: req.params.prdID });
    const store = await Store.find({ _id: product[0]['storeId'] });

    let category = product[0].category;
    let subcategory = product[0].subcategory;
    const relatedPrds = await Product.find({ category, subcategory });

    const comments = await Comments.find({ prdID: req.params.prdID });
    let isOrdered = false;
    let isOrderedOutdated = false;

    if (req.session.user) {
        // console.log('User logged in')
        const orders = await Orders.find({ customerId: req.session.user._id }, { items: 1, createdAt: 1, _id: 0 });
        if (orders.length > 0) {
            for (let i = 0; i < orders.length; i++) {
                for (let id in orders[i].items) {
                    let ordTime = new Date(orders[i].createdAt).getTime() + (90 * 24 * 60 * 60 * 1000);
                    let today = new Date().getTime();

                    if (ordTime < today) {
                        // console.log('Order is Outdated')
                        isOrderedOutdated = true;
                    }

                    if (req.params.prdID == id) {
                        isOrdered = true;
                    }
                }
            }
        }
    }

    let commentedUsersIds = [];
    for (const key in comments) {
        const id = comments[key].userID;
        commentedUsersIds.push(id);
    }
    let commentedUsers = await Users.find({ _id: commentedUsersIds }, { first_name: 1, last_name: 1 })
    return res.render('customers/shop-single', { product, store, relatedPrds, comments, isOrdered, isOrderedOutdated, commentedUsers });

};

function catProdShowController() {
    return {
        async showCategory(req, res) {
            const products = await Product.find({ category: req.params.category });

            return res.render('customers/shop', { products });
        },

        async showSubCategory(req, res) {
            const products = await Product.find({ category: req.params.category, subcategory: req.params.subCategory });

            return res.render('customers/shop', { products });
        },

        async viewProduct(req, res) {
            viewProdFunc(req, res);
        },
        
        // async viewProductwithMsg(req, res) {
        //     viewProdFunc(req, res, req.params.msg);
        // }
    }
}

module.exports = catProdShowController;