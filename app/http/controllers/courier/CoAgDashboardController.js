const CourierAgents = require("../../../models/courierAgents");
const Orders = require("../../../models/order");
const Product = require("../../../models/product");
const Users = require("../../../models/user");
const bcrypt = require('bcrypt')

function CourierAgentDashboardController() {
    return {

        async getAgentDashboard(req, res) {

            let msg = req.params.msg;

            if (req.session.courierAgents) {
                var courierAgents = req.session.courierAgents;


                let allOrds = await Orders.find();
                totalOrd = allOrds.length;

                let stOrdIdArr = [];
                let stOrd = [];

                for (let i = 0; i < allOrds.length; i++) {
                    let addree = JSON.parse(allOrds[i].address);
                    if (courierAgents.state === addree['add-state']) {
                        stOrdIdArr.push(allOrds[i]._id);
                    }
                }
                for (let j = 0; j < stOrdIdArr.length; j++) {
                    let stateOrd = await Orders.findById({ _id: stOrdIdArr[j] });
                    let customerName = await Users.find({ _id: stateOrd['customerId'] }, { "first_name": 1, "last_name": 1, "_id": 1 });

                    stOrd.push(stateOrd);
                }
                stOrd = stOrd.reverse();

                let calData = {
                    "total": totalOrd,
                    "stOrd": stOrd.length,
                }

                //Extract Products
                let prdIDArr = [];
                let prdArr = [];
                for (let k = 0; k < stOrd.length; k++) {
                    for (const key in stOrd[k].items) {
                        if (prdIDArr.indexOf(stOrd[k].items[key].item) === -1 && stOrd[k].items[key].item !== undefined) {
                            prdIDArr.push(stOrd[k].items[key].item);
                        }
                    }
                }

                for (let l = 0; l < prdIDArr.length; l++) {
                    let custProd = await Product.find({ _id: prdIDArr[l] }, { "name": 1, "_id": 1 });
                    prdArr.push(custProd[0]);
                }

                return res.render('courier/CouAgeDashboard', { msg, cAg: true, courierAgents, calData, stOrd, prdArr });

            } else {
                return res.render('courier/CouAgeDashboard', { msg, cAg: false });
            }
        },

        async couAgeLogin(req, res, next) {
            const { email, password, role } = req.body;

            if (!email || !password || !role) {
                let msg = 'undefined';
                return res.redirect(`/courieAgeDashBoard/${msg}`);
            }

            const isExist = await CourierAgents.count({ email: email, role: 'courierAgent' })
            if (!isExist) {
                let msg = 'existed';
                return res.redirect(`/courieAgeDashBoard/${msg}`);
            }

            const courierAgents = await CourierAgents.findOne({ email: email })
            if (courierAgents) {
                const result = await bcrypt.compare(password, courierAgents.password);
                if (result) {
                    if (req.session.user) {
                        delete req.session.user
                        // req.session.regenerate((err) => {
                        //     if (err) {
                        //         console.log(err);
                        //     }
                        // })
                        req.session.courierAgents = courierAgents;
                    } else {
                        req.session.courierAgents = courierAgents;
                    }

                    let msg = 'loggedIn';
                    return res.redirect(`/courieAgeDashBoard/${msg}`);
                } else {
                    let msg = 'err';
                    return res.redirect(`/courieAgeDashBoard/${msg}`);
                }
            } else {
                let msg = 'serverErr';
                return res.redirect(`/courieAgeDashBoard/${msg}`);
            }
        },

        async couAgeChangeStatus(req, res) {
            // console.log("both");
            const { orderId, status } = req.body;

            if (orderId && status) {
                if (status === 'completed') {
                    Orders.updateOne({ _id: orderId }, { paymentStatus: true }, (err, data) => {
                        if (err) {
                            return res.json({
                                msg: "notUpdated"
                            })
                        }
                    })
                }

                if (status === 'returned' || status === 'cancelled') {
                    Orders.updateOne({ _id: orderId }, { paymentStatus: false }, (err, data) => {
                        if (err) {
                            return res.json({
                                msg: "notUpdated"
                            })
                        }
                    })
                }

                Orders.updateOne({ _id: orderId }, { status: status }, async (err, data) => {
                    if (err) {
                        return res.json({
                            msg: "notUpdated"
                        })
                    }

                    let orderUpdated = await Orders.findById({ _id: orderId });
                    // console.log(orderUpdated)

                    //Emit event
                    const eventEmitter = req.app.get('eventEmitter')
                    eventEmitter.emit('orderUpdated', orderUpdated)

                    return res.json({
                        msg: "updated",
                        orderUpdated
                    })
                })
            } else {
                return res.json({
                    msg: "notUpdated"
                })
            }
        },
    }
}

module.exports = CourierAgentDashboardController