const User = require("../../../models/user");
const Product = require("../../../models/product");
const Order = require("../../../models/order");
const Store = require("../../../models/store");
const Math = require("mathjs");
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)


function orderController() {
    return {
        async index(req, res) {
            res.render("customers/placeOrd");
        },
        async payBill(req, res) {
            let add = req.params.add;
            let payMth = req.params.payMth;
            let user = req.session.user;
            let cart = req.session.user.cart;
            var totalAmount = 0;
            var totalDisAmount = 0;

            let prdArr = [];
            for (const key in cart) {
                if (key == `custID_${req.session.user._id}_cart`) {
                    for (const itemKey in cart[key].items) {
                        prdArr.push(itemKey);
                    }
                }
            }
            const cartProduct = await Product.find({ _id: prdArr });
            prdArr.map((key) => {
                cartProduct.forEach((prd) => {
                    if (prd._id == key) {
                        let totalPrice = prd.price;
                        let discount = prd.discount;
                        let cartQty = 0;

                        let feature = cart[`custID_${user._id}_cart`].items[key].feature;
                        feature.map((item) => {
                            cartQty += item.qty
                        })

                        totalPrice = totalPrice * parseInt(cartQty);

                        let disPrice = (totalPrice / 100) * discount;
                        totalDisAmount = totalDisAmount + disPrice;

                        var finalPrice = totalPrice - disPrice;
                        totalAmount = totalAmount + finalPrice;
                    }
                });
            });
            res.render("customers/payBill", {
                add,
                payMth,
                totalAmount,
                totalDisAmount,
            });
        },
        async showPlacedOrder(req, res) {
            let userData = await User.findById({ _id: req.session.user._id });
            let custOrders = await Order.find({ customerId: req.session.user._id }, null, { sort: { createdAt: -1 } });
            let prdIDArr = [];
            let prdArr = [];
            let strIDArr = {};

            for (let i = 0; i < custOrders.length; i++) {
                for (const key in custOrders[i].items) {
                    if (prdIDArr.indexOf(custOrders[i].items[key].item) === -1 && custOrders[i].items[key].item !== undefined) {
                        prdIDArr.push(custOrders[i].items[key].item);
                    }
                }
            }

            for (let i = 0; i < prdIDArr.length; i++) {
                let custProd = await Product.findById({ _id: prdIDArr[i] });

                prdArr.push(custProd);
                let res = await Store.findById({ _id: custProd.storeId });

                let obj = {
                    [custProd.storeId]: res.storename,
                };

                strIDArr = {...strIDArr, ...obj };
            }

            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
            res.render("customers/custOrders", { userData, custOrders, prdArr, prdIDArr, strIDArr });
        },
        async placeOrder(req, res) {
            const { token, addressToDel, finalAmount, finalPayMth } = req.body;
            let address = JSON.parse(addressToDel);

            function savaOrderFunc(order, req, res) {
                order.save()
                    .then(async(order) => {

                        if (!finalPayMth && token) {
                            stripe.charges.create({
                                    amount: finalAmount * 100,
                                    source: token,
                                    currency: 'inr',
                                    description: `shopyCrazer_order: ${order._id}`
                                })
                                .then(() => {
                                    order.save()
                                        .then(async(ord) => {
                                            //Emit event
                                            const eventEmitter = req.app.get('eventEmitter')
                                            eventEmitter.emit('orderPlaced', { order: ord })

                                            const result = await User.updateOne({ _id: req.session.user._id }, { $unset: { cart: "" } });
                                            if (!result) {
                                                res.redirect("/cart");
                                            }

                                            return res.json({ message: 'Payment successful, Order placed successfully' });
                                        })
                                        .catch((err) => {
                                            console.log(err)
                                            return res.json({ message: 'We are facing a problem.' });
                                        })

                                })
                                .catch(async(err) => {
                                    order.paymentStatus = false
                                    order.paymentType = 'COD'

                                    const eventEmitter = req.app.get('eventEmitter')
                                    eventEmitter.emit('orderPlaced', { order: order })

                                    const result = await User.updateOne({ _id: req.session.user._id }, { $unset: { cart: "" } });
                                    if (!result) {
                                        res.redirect("/cart");
                                    }

                                    return res.json({ message: 'Order Placed but payment failed, You can pay at delivery time' });
                                })
                        } else {
                            const eventEmitter = req.app.get('eventEmitter')
                            eventEmitter.emit('orderPlaced', { order: order })

                            const result = await User.updateOne({ _id: req.session.user._id }, { $unset: { cart: "" } });
                            if (!result) {
                                res.redirect("/cart");
                            }

                            res.redirect('/cust/myOrders');
                        }
                    })
                    .catch((err) => {
                        res.redirect("/cart");
                    });
            }

            if (finalPayMth) { //if this is true then payment method will be COD
                //Add a new order
                const order = new Order({
                    customerId: req.session.user._id,
                    items: req.session.user.cart["custID_" + req.session.user._id + "_cart"].items,
                    phone: address["add-phone"],
                    address: JSON.stringify(address),
                    amount: parseInt(finalAmount),
                });

                savaOrderFunc(order, req, res);
            } else {
                //Add a new order
                const order = new Order({
                    customerId: req.session.user._id,
                    items: req.session.user.cart["custID_" + req.session.user._id + "_cart"].items,
                    phone: address["add-phone"],
                    address: JSON.stringify(address),
                    paymentType: "online",
                    paymentStatus: true,
                    amount: parseInt(finalAmount),
                });

                savaOrderFunc(order, req, res);
            }
            // res.render('customers/custOrders');
        },
        async payOnlineLater(req, res) {
            let result = await Order.updateOne({ _id: req.params.ordID }, { $set: { paymentStatus: true, paymentType: 'online' } });
            if (result) {
                res.redirect(`/orderDetails/${req.params.ordID}/${req.params.feaInd}/${req.params.prdID}`);
            } else {
                res.redirect("/");
            }

        },
        async showPlacedOrderDetails(req, res) {
            let order = await Order.findById({ _id: req.params.ordID });
            let product = await Product.findById({ _id: req.params.prdID });
            let feaInd = req.params.feaInd;

            let store = await Store.findById({ _id: product.storeId });
            let seller = store.storename;

            let otherPrdIDArr = [];
            let otherPrd = [];
            let strIDArr = {};

            for (const key in order.items) {
                otherPrdIDArr.push(key);
            }

            for (let i = 0; i < otherPrdIDArr.length; i++) {
                let result = await Product.findById({ _id: otherPrdIDArr[i] });
                otherPrd.push(result);
                let res = await Store.findById({ _id: result.storeId });

                let obj = {
                    [result.storeId]: res.storename,
                };

                strIDArr = {...strIDArr, ...obj };
            }


            res.render("customers/custOrdDetails", { order, product, feaInd, seller, otherPrd, strIDArr });
        },
        async cancelOrd(req, res) {
            let result = await Order.updateOne({ _id: req.params.ordID }, { $set: { status: 'cancelled' } });
            if (result) {
                res.redirect(`/orderDetails/${req.params.ordID}/${req.params.feaInd}/${req.params.prdID}`);
            } else {
                res.redirect("/cust/myOrders");
            }
        },
        async returnOrd(req, res) {
            const { ordID, feaInd, prdID } = req.params;
            const { returnWhat } = req.body;

            //================================================================================================
            //General Functions
            const whenErrCome = (res, ordID, feaInd, prdID) => {
                res.redirect(`/orderDetails/${ordID}/${feaInd}/${prdID}`);
            };

            const placeNewOrdFunc = (res, returnOrder, items, price) => {
                let order = new Order({
                    customerId: returnOrder.customerId,
                    items: items,
                    phone: returnOrder.phone,
                    address: returnOrder.address,
                    paymentType: returnOrder.paymentType,
                    paymentStatus: returnOrder.paymentStatus,
                    amount: parseInt(price),
                    status: 'returned',
                    createdAt: returnOrder.createdAt
                });
                order.save()
                    .then((order) => {
                        // console.log(order);
                        res.redirect(`/orderDetails/${order._id}/0/${prdID}`);
                    })
                    .catch((err) => {
                        whenErrCome(res, ordID, feaInd, prdID);
                    })
            };

            const calcNewPriceFunc = (feature, index) => {
                let newPrice = [(feature[index].price * feature[index].qty) / 100] * feature[index].discount;
                newPrice = (feature[index].price * feature[index].qty) - newPrice;
                newPrice = Math.round(newPrice);

                return newPrice;
            };

            const moreThanOneFeatureFunc = (returnOrder, key, ordID) => {
                let feature = returnOrder.items[key].feature;

                feature.map(async(value, index) => {
                    if (index == feaInd) {
                        let newFeature = [];
                        feature.map((fea, i) => {
                            if (index != i) {
                                newFeature.push(fea);
                            }
                        })

                        let newPrice = calcNewPriceFunc(feature, index);

                        returnOrder.items[key].feature = newFeature;

                        //Update the Parent Order
                        let parentOrdAmount = returnOrder.amount - newPrice;
                        const returnOrderRes = await Order.updateOne({ _id: ordID }, { $set: { items: returnOrder.items, amount: parentOrdAmount } });

                        //Create a new order
                        let itemsNew = {
                            [prdID]: {
                                item: prdID,
                                feature: [{...value }]
                            }
                        };
                        placeNewOrdFunc(res, returnOrder, itemsNew, newPrice);
                    }
                });
            };
            //================================================================================================

            //When user want to return all orders
            if (returnWhat == 'all') {

                const returnOrderRes = await Order.updateOne({ _id: ordID }, { $set: { status: 'returned' } });
                whenErrCome(res, ordID, feaInd, prdID);
            }
            //When user want to return perticular item from the order
            else if (returnWhat == 'one') {

                const returnOrder = await Order.findById({ _id: ordID });

                //If order contain only one product then
                if (Object.keys(returnOrder.items).length <= 1) {
                    for (const key in returnOrder.items) {

                        //if product has only one feature then
                        if (Object.keys(returnOrder.items[key].feature).length <= 1) {
                            const returnOrderRes = await Order.updateOne({ _id: ordID }, { $set: { status: 'returned' } });
                            res.redirect(`/orderDetails/${ordID}/${feaInd}/${prdID}`);
                        }
                        //if product has more than one feature then
                        else {
                            if (key == prdID) {
                                moreThanOneFeatureFunc(returnOrder, key, ordID);
                            }
                        }
                    }

                }
                //If order contain more than one products then
                else {
                    for (const key in returnOrder.items) {
                        if (key == prdID) {

                            //if product has only one feature then
                            if (Object.keys(returnOrder.items[key].feature).length <= 1) {

                                let feature = returnOrder.items[key].feature;
                                let newPrice = calcNewPriceFunc(feature, 0);

                                let newOrdItm = {
                                    [prdID]: returnOrder.items[prdID]
                                };

                                //Update the Parent Order
                                let parentOrdAmount = returnOrder.amount - newPrice;
                                delete returnOrder.items[prdID]

                                const returnOrderRes = await Order.updateOne({ _id: ordID }, { $set: { items: returnOrder.items, amount: parentOrdAmount } });

                                //Create a new order
                                placeNewOrdFunc(res, returnOrder, newOrdItm, newPrice);

                            }
                            //if product has more than one feature then
                            else {
                                moreThanOneFeatureFunc(returnOrder, key, ordID);
                            }
                        }
                    }
                }
            }

        }
    };
}

module.exports = orderController;