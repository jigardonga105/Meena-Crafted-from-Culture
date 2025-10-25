const { json } = require("express");
const User = require("../../../models/user");
const Product = require("../../../models/product");
const Store = require("../../../models/store");

function cartController() {
    return {
        async cart(req, res) {
            let cart = req.session.user.cart;

            let prdArr = [];
            for (const key in cart) {
                if (key == `custID_${req.session.user._id}_cart`) {
                    for (const itemKey in cart[key].items) {
                        prdArr.push(itemKey);
                    }
                }
            }
            const cartProduct = await Product.find({ _id: prdArr });
            let strNameArr = [];
            for (const key in cartProduct) {
                const storeName = await Store.findById({ _id: cartProduct[key].storeId }).select({ storename: 1, _id: 0 });
                strNameArr.push(storeName["storename"]);
            }
            return res.render("customers/cart", { cartProduct, strNameArr });
        },
        async addToCart(req, res) {
            if (req.body.product) {
                let {product, prdQty, color, size} = req.body

                prdQty = parseInt(prdQty);

                if(color == undefined && product.color[0]){
                    color = product.color[0];
                }
                if(size == undefined && product.size[0]){
                    size = product.size[0];
                }

                
                // if user logged in
                if (req.session.user) {
                    if (!req.session.user.cart) {
                        // if cart array not found
                        req.session.user.cart = {};
                    }
                    let cart = req.session.user.cart;

                    // check whether it is a customer or not
                    if (req.session.user.role == "customer") {
                        if (!cart["custID_" + req.session.user._id + "_cart"]) {
                            //Check customer's cart is already exists if not then make cartObject
                            cart["custID_" + req.session.user._id + "_cart"] = {
                                items: {},
                                totalQty: 0,
                                totalPrice: 0,
                            };
                        }

                        // Check if item does not exist in cart
                        if (!cart["custID_" + req.session.user._id + "_cart"].items[product._id]) {

                            //if not then add item in to the cart
                            let featureObj = {
                                color,
                                size,
                                qty: prdQty,
                                price: product.price,
                                discount: product.discount
                            }
                            cart["custID_" + req.session.user._id + "_cart"].items[product._id] = {
                                item: product._id,
                                feature: [ { ...featureObj } ],
                            };
                            cart["custID_" + req.session.user._id + "_cart"].totalQty = cart["custID_" + req.session.user._id + "_cart"].totalQty + prdQty;
                            cart["custID_" + req.session.user._id + "_cart"].totalPrice = cart["custID_" + req.session.user._id + "_cart"].totalPrice + (product.price * prdQty);

                            //update the cart in database
                            const result = await User.updateOne({ _id: req.session.user._id }, { $set: { cart: req.session.user.cart} });

                        } else {
                            //if item already exist in the cart
                            let feature = req.session.user.cart["custID_" + req.session.user._id + "_cart"].items[product._id].feature;
                            let isMatch = false;
                            let previousFeat = [];

                            feature.map((prdFeature) => {
                                previousFeat = [ ...previousFeat, { ...prdFeature } ];

                                //check if feature already exists in the cart is same as new feature
                                if(prdFeature['color'] == color && prdFeature['size'] == size){
                                    //is same then only update that previously existing feature
                                    isMatch = true;

                                    prdFeature['qty'] = prdFeature['qty'] + prdQty;
                                    prdFeature['price'] = product.price;
                                    prdFeature['discount'] = product.discount;
                                    cart["custID_" + req.session.user._id + "_cart"].totalQty = cart["custID_" + req.session.user._id + "_cart"].totalQty + prdQty;
                                    cart["custID_" + req.session.user._id + "_cart"].totalPrice = cart["custID_" + req.session.user._id + "_cart"].totalPrice + (product.price * prdQty);

                                }
                            })
                            if(!isMatch){
                                //is not same then add new feature
                                let featureObj = {
                                    color,
                                    size,
                                    qty: prdQty,
                                    price: product.price,
                                    discount: product.discount
                                }

                                cart["custID_" + req.session.user._id + "_cart"].items[product._id].feature = [ ...previousFeat, { ...featureObj } ];

                                cart["custID_" + req.session.user._id + "_cart"].totalQty = cart["custID_" + req.session.user._id + "_cart"].totalQty + prdQty;
                                cart["custID_" + req.session.user._id + "_cart"].totalPrice = cart["custID_" + req.session.user._id + "_cart"].totalPrice + (product.price * prdQty);
                                
                                //update the cart in database
                                const result = await User.updateOne({ _id: req.session.user._id }, { $set: { cart: req.session.user.cart} });
                            }
                            //update the cart in database
                            const result = await User.updateOne({ _id: req.session.user._id }, { $set: { cart: req.session.user.cart} });

                        }

                        req.session.user = await User.findById(req.session.user._id);
                        const eventEmitter = req.app.get('eventEmitter')
                        eventEmitter.emit('cartUpdated', req.session.user)

                        return res.json({
                            totalQty: req.session.user.cart["custID_" + req.session.user._id + "_cart"].totalQty,
                        });
                    } else {
                        //user is not a customer
                        return res.json({
                            msg: "Currently you are not Customer.",
                        });
                    }
                } else {
                    //user is not logged in
                    return res.json({
                        msg: "You are not logged in",
                    });
                }
            } else {
                //data not submitted
                return res.json({
                    msg: "We are facing some essuse. Please try again later 🙏",
                });
            }
        },
        async updateCart(req, res) {
            if (req.body.plus) {
                let cart = req.session.user.cart;
                let qty;
                let totalQty;
                let totalPrice;

                for (const key in cart) {
                    if (key == `custID_${req.session.user._id}_cart`) {
                        for (const itemKey in cart[key].items) {
                            if (itemKey == req.body.prdID) {

                                cart[key].items[itemKey].feature[req.body.featureKey].qty = cart[key].items[itemKey].feature[req.body.featureKey].qty + 1;
                                qty = cart[key].items[itemKey].feature[req.body.featureKey].qty;

                            }
                        }
                        cart["custID_" + req.session.user._id + "_cart"].totalQty = cart["custID_" + req.session.user._id + "_cart"].totalQty + 1;
                        totalQty = cart["custID_" + req.session.user._id + "_cart"].totalQty;

                        cart["custID_" + req.session.user._id + "_cart"].totalPrice = cart["custID_" + req.session.user._id + "_cart"].totalPrice + req.body.prdPrice;
                        totalPrice = cart["custID_" + req.session.user._id + "_cart"].totalPrice;
                    }
                }
                const result = await User.updateOne({ _id: req.session.user._id }, { $set: { cart: req.session.user.cart} });
                req.session.user = await User.findById(req.session.user._id);
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('cartUpdated', req.session.user)
                return res.json({
                    qty,
                    totalQty,
                    totalPrice,
                });
            }
            if (req.body.min) {
                let cart = req.session.user.cart;
                let qty;
                let totalQty;
                let totalPrice;

                for (const key in cart) {
                    if (key == `custID_${req.session.user._id}_cart`) {
                        for (const itemKey in cart[key].items) {
                            if (itemKey == req.body.prdID) {
                                cart[key].items[itemKey].feature[req.body.featureKey].qty = cart[key].items[itemKey].feature[req.body.featureKey].qty - 1;
                                qty = cart[key].items[itemKey].feature[req.body.featureKey].qty;
                            }
                        }
                        cart["custID_" + req.session.user._id + "_cart"].totalQty =
                            cart["custID_" + req.session.user._id + "_cart"].totalQty - 1;
                        totalQty = cart["custID_" + req.session.user._id + "_cart"].totalQty;

                        cart["custID_" + req.session.user._id + "_cart"].totalPrice =
                            cart["custID_" + req.session.user._id + "_cart"].totalPrice -
                            req.body.prdPrice;
                        totalPrice = cart["custID_" + req.session.user._id + "_cart"].totalPrice;
                    }
                }
                const result = await User.updateOne({ _id: req.session.user._id }, { $set: { cart: req.session.user.cart} });
                req.session.user = await User.findById(req.session.user._id);
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('cartUpdated', req.session.user)
                return res.json({
                    qty,
                    totalQty,
                    totalPrice,
                });
            }
        },
        async deleteCartPrd(req, res) {
            if (req.body.removePrdId && req.body.removePrdPrice) {
                let removePrdId = req.body.removePrdId;
                let removePrdPrice = parseInt(req.body.removePrdPrice);
                let removePrdfeatKey = req.body.removePrdfeatKey;
                let haveToRedirect = req.body.haveToRedirect;

                let cart = req.session.user.cart;
                let itemsObj = {};
                let featureArr = [];
                let isSave = false;

                for (const key in cart) {
                    if (key == `custID_${req.session.user._id}_cart`) {
                        for (const itemKey in cart[key].items) {
                            if (itemKey == removePrdId) {
                                
                                cart["custID_" + req.session.user._id + "_cart"].totalQty = cart[key].totalQty - cart[key].items[itemKey].feature[removePrdfeatKey].qty;
                                cart["custID_" + req.session.user._id + "_cart"].totalPrice = cart[key].totalPrice - removePrdPrice * cart[key].items[itemKey].feature[removePrdfeatKey].qty;

                                let cartFeatureArr = cart[key].items[itemKey].feature;
                                for(let featureKey in cartFeatureArr)
                                {
                                    let obj = cartFeatureArr[featureKey];
                                    
                                    if(cartFeatureArr.length === 1){
                                        delete cart["custID_" + req.session.user._id + "_cart"].items[removePrdId]
                                    }
                                    else if(featureKey != removePrdfeatKey){
                                        isSave = true;
                                        featureArr = [...featureArr, {...obj}];
                                    }
                                }
                            }
                        }
                    }
                }
                isSave ? cart[`custID_${req.session.user._id}_cart`].items[removePrdId].feature = featureArr : null;

                const result = await User.updateOne({ _id: req.session.user._id }, { $set: { cart: req.session.user.cart} });
                req.session.user = await User.findById(req.session.user._id);
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('cartUpdated', req.session.user)
                if (haveToRedirect == true || haveToRedirect == 'true') {
                    return res.redirect('/cart');
                } else {
                    return res.send('true');
                }
            }
        }
    };
}

module.exports = cartController;
