const Menu = require('../../../models/menu')

function rateController() {
    return {
        async index(req, res) {
            const product = await Menu.find({ _id: req.body.pdID })

            //=========================================================================================================

            if (!req.session.rate) {
                req.session.rate = {}
            }

            let rate = req.session.rate

            if (!rate['custID_' + req.session.user._id + '_rate']) {
                rate['custID_' + req.session.user._id + '_rate'] = {
                    products: {}
                }
            }

            if (!rate['custID_' + req.session.user._id + '_rate'].products[req.body.pdID]) {

                rate['custID_' + req.session.user._id + '_rate'].products[req.body.pdID] = {
                    item: product[0],
                    rate: req.body.rate
                }

            } else {

                rate['custID_' + req.session.user._id + '_rate'].products[req.body.pdID] = { item: product[0], rate: req.body.rate }
            }

            //=========================================================================================================

            if (!req.session.vote) {
                req.session.vote = {}
            }

            let vote = req.session.vote

            if (!vote[req.body.pdID]) {

                vote[req.body.pdID] = {
                    _id: req.body.pdID,
                    vote: 1
                }
            }

            //=========================================================================================================

            if (!req.session.ProductsRate) {
                req.session.ProductsRate = {}
            }

            let ProductsRate = req.session.ProductsRate

            if (!ProductsRate[req.body.pdID]) {
                ProductsRate[req.body.pdID] = {
                    _id: req.body.pdID,
                    rating: product[0].rating
                }
            } else {

                // let finalRating = ProductsRate[req.body.pdID].rating = (parseInt(ProductsRate[req.body.pdID].rating) + parseInt(req.body.rate)) / parseInt(vote[req.body.pdID].vote)

                ProductsRate[req.body.pdID] = {
                    _id: req.body.pdID,
                    rating: parseInt(req.body.rate)
                }
            }

            //=========================================================================================================

            let rateID = rate['custID_' + req.session.user._id + '_rate'].products[req.body.pdID].item._id
            let rateRate = rate['custID_' + req.session.user._id + '_rate'].products[req.body.pdID].rate

            for (let i = 0; i >= 0; i++) {

                if (vote[req.body.pdID]._id == rateID) {

                    let rateArray = []
                    for (var key in rate) {
                        if (rate.hasOwnProperty(key)) {
                            for (var key2 in rate[key].products) {
                                if (rate[key].products.hasOwnProperty(key2)) {
                                    // console.log(rate[key].products[key2].rate);
                                    rateArray.push(parseInt(rate[key].products[key2].rate));
                                }
                            }
                        }
                    }

                    // console.log(rateArray);
                    const reducer = (accumulator, currentValue) => accumulator + currentValue;
                    // console.log(rateArray.reduce(reducer));

                    ProductsRate[req.body.pdID].rating = rateArray.reduce(reducer)
                        // console.log(Object.keys(rate).length);

                    vote[req.body.pdID].vote = Object.keys(rate).length

                    let rating = ProductsRate[req.body.pdID].rating / vote[req.body.pdID].vote
                    console.log(rating);

                    const result2 = await Menu.updateOne({ _id: req.body.pdID }, { $set: { vote: vote[req.body.pdID].vote } })

                    const result3 = await Menu.updateOne({ _id: req.body.pdID }, { $set: { rating: rating } })

                    if (result2 && result3) {
                        const pizzas = await Menu.find()
                        return res.render('home', {
                            pizzas: pizzas
                        })
                    }
                }
            }

            //=========================================================================================================
        }
    }
}

module.exports = rateController