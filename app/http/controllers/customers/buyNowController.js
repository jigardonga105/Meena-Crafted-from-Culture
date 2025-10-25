const User = require("../../../models/user");
const Product = require("../../../models/product");
const Order = require("../../../models/order");
const Store = require("../../../models/store");
const Math = require("mathjs");
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

function buyNowController() {
    return {
        async buyNow(req, res) {
            if (req.body.product) {
                // console.log("req.body.product come")
                let {product, prdQty, color, size} = req.body
                product = JSON.parse(product);
                prdQty = parseInt(prdQty);
                
                if(color === 'undefined' && product.color[0]){
                    color = product.color[0];
                }
                if(size === 'undefined' && product.size[0]){
                    size = product.size[0];
                }

                let buyNowProductData = {
                    product,
                    prdQty,
                    color,
                    size
                }

                return res.render("customers/buyNow", { buyNowProductData });
            } else {
                // console.log("req.body.product not come")
                return res.redirect('/shop');
            }
        },

        async placeOrderOfBuyNow(req, res) {
            const { token, addressToDel, finalAmount, finalPayMth } = req.body;
            // console.log("req.body: ", req.body)
            
            let address = JSON.parse(addressToDel);
            let itemsObj = JSON.parse(req.body.itemsObj);

            function savaOrderFunc(order, req, res) {
                order.save()
                    .then(async(order) => {

                        if (!finalPayMth && token) {
                            //When the payment method is Online
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

                                    return res.json({ message: 'Order Placed but payment failed, You can pay at delivery time' });
                                })
                        } else {
                            //When the payment method is COD
                            const eventEmitter = req.app.get('eventEmitter')
                            eventEmitter.emit('orderPlaced', { order: order })

                            res.redirect('/cust/myOrders');
                        }
                    })
                    .catch((err) => {
                        res.redirect("/cart");
                    });
            }

            if (finalPayMth) { 
                //When payment method is COD
                //Add a new order
                const order = new Order({
                    customerId: req.session.user._id,
                    items: itemsObj,
                    phone: address["add-phone"],
                    address: JSON.stringify(address),
                    amount: parseInt(finalAmount),
                });

                savaOrderFunc(order, req, res);
            } else {
                //When payment method is Online
                //Add a new order
                const order = new Order({
                    customerId: req.session.user._id,
                    items: itemsObj,
                    phone: address["add-phone"],
                    address: JSON.stringify(address),
                    paymentType: "online",
                    paymentStatus: true,
                    amount: parseInt(finalAmount),
                });

                savaOrderFunc(order, req, res);
            }
        }
    }
}

module.exports = buyNowController