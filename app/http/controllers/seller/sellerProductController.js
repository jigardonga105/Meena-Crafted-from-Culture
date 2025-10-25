const Store = require('../../../models/store')
const Product = require('../../../models/product')
const fs = require('fs');
// const Noty = require('noty');


function sellerProductController() {
    return {
        async index(req, res) {
            const store = await Store.exists({ sellerId: req.session.user._id });
            const storeData = await Store.find({ _id: req.params.strID });
            const product = await Product.find({ storeId: req.params.strID })

            if (store) {
                return res.render('seller/store', { store: true, storeData, product })
            } else {
                return res.render('seller/store', { store: false })
            }
        },

        addProduct(req, res) {
            let { storeID, category, subcategory, productname, price, discount, productdesc, offer, warr, size, color, highlight, payops, service, specification } = req.body

            offer = JSON.parse(offer)
            warr = JSON.parse(warr)
            size = JSON.parse(size).divsArr
            color = JSON.parse(color).divsArr
            highlight = JSON.parse(highlight).divsArr
            payops = JSON.parse(payops).divsArr
            service = JSON.parse(service).divsArr
            specification = JSON.parse(specification)


            if (!category || !subcategory || !productname || !price || !productdesc) {
                req.flash('error', 'Some Fields must be required')
                req.flash('productname', productname)
                req.flash('price', price)
                req.flash('productdesc', productdesc)
                return res.redirect(`/seller/store/${storeID}`)
            }

            if (payops && payops.length === 0) {
                req.flash('error', 'Payment Options are required')
                req.flash('productname', productname)
                req.flash('price', price)
                req.flash('productdesc', productdesc)
                return res.redirect(`/seller/store/${storeID}`)
            }
            
            let productPictures = [];
            
            if (req.files.length > 0) {
                productPictures = req.files.map((file) => {
                    return { img: file.filename };
                });
            } else {
                req.flash('error', 'Atleast one product image is required')
                req.flash('productname', productname)
                req.flash('price', price)
                req.flash('productdesc', productdesc)
                return res.redirect(`/seller/store/${storeID}`)
            }

            if (offer || warr || size || color || highlight || payops || service || productdesc || specification) {
                let product = new Product({
                        category,
                        subcategory,
                        storeId: storeID,
                        image: productPictures,
                        name: productname,
                        price,
                        discount,
                        offer,
                        Warr_Garr: warr,
                        size,
                        color,
                        highlight,
                        payment_ops: payops,
                        service,
                        desc: productdesc,
                        specification
                    })
                    // console.log(product);
                product.save()
                    .then((result) => {
                        return res.redirect(`/seller/store/${storeID}`)
                    })
                    .catch((err) => {
                        console.log(err);
                        req.flash('error', 'Something went wrong')
                        return res.redirect(`/seller/store/${storeID}`)
                    })
            } else {
                req.flash('error', 'Internal Server Error')
                return res.redirect(`/seller/store/${storeID}`)
            }
        },

        async showProduct(req, res) {
            const product = await Product.findById({ _id: req.params.prdID });
            if (product) {
                return res.render('seller/product', { product })
            } else {
                return res.redirect('/');
            }
        },

        async updateProduct(req, res) {
            const product = await Product.findById({ _id: req.params.prdID });
            const imageSet = await Product.findById({ _id: req.params.prdID }).select({ _id: 0, image: 1 })
            if (product) {
                return res.render('seller/prodUpdate', { product, imageSet })
            } else {
                return res.redirect('/');
            }
        },

        async deleteItemImage(req, res) {
            // console.log(req.params.img);
            // console.log(req.params.prdID);
            let imageSet = await Product.find({ _id: req.params.prdID }).select({ image: 1, _id: 0 })

            const del = await Product.updateOne({ _id: req.params.prdID }, { $pull: { image: { img: req.params.img } } }, { multi: true })
                // console.log(del);
            if (del) {
                fs.unlink(`public/uploadedImages/${req.params.img}`, (err, res) => {
                    if (err) {
                        console.log(err);
                    }
                })
            }
        },

        async addItemImage(req, res) {

            let productPictures = [];

            if (req.files.length > 0) {
                productPictures = req.files.map((file) => {
                    return { img: file.filename };
                });
            }

            const result = await Product.updateOne({ _id: req.params.prdID }, { $push: { image: { $each: productPictures } } })
                // console.log(result);
            if (result) {
                return res.redirect(`/seller/productUpdate/${req.params.prdID}`)
            } else {
                return res.render('/')
            }
        },

        async updateProdPost(req, res) {

            function resultRedirect(result) {
                if (result) {
                    return res.redirect(`/seller/productUpdate/${req.params.prdID}`)
                } else {
                    return res.render('/')
                }
            }

            if (req.body.category && req.body.subcategory) {
                let category = req.body.category;
                let subcategory = req.body.subcategory;

                const result = await Product.updateOne({ _id: req.params.prdID }, { $set: { category, subcategory } })
                resultRedirect(result)
            }
            if (req.body.stock) {
                var stock;
                if (req.body.stock == 'in') {
                    stock = true;
                } else if (req.body.stock == 'out') {
                    stock = false;
                }

                const result = await Product.updateOne({ _id: req.params.prdID }, { $set: { stock } })
                resultRedirect(result)
            }
            if (req.body.changedname) {
                let name = req.body.changedname;
                const result = await Product.updateOne({ _id: req.params.prdID }, { $set: { name } })
                resultRedirect(result)
            }
            if (req.body.changedprice) {
                let price = req.body.changedprice;
                const result = await Product.updateOne({ _id: req.params.prdID }, { $set: { price } })
                resultRedirect(result)
            }
            if (req.body.changeddiscount) {
                let discount = req.body.changeddiscount;
                discount = parseInt(discount);

                if (discount >= 0 && discount <= 100) {
                    const result = await Product.updateOne({ _id: req.params.prdID }, { $set: { discount } })
                    resultRedirect(result)
                } else {
                    return res.redirect(`/seller/productUpdate/${req.params.prdID}`)
                }
            }
            if (req.body.desc) {
                let desc = req.body.desc;
                const result = await Product.updateOne({ _id: req.params.prdID }, { $set: { desc } })
                resultRedirect(result)
            }
            if (req.body.offer) {
                let offer = JSON.parse(req.body.offer)
                const result = await Product.updateOne({ _id: req.params.prdID }, { $set: { offer } })
                resultRedirect(result)
            }
            if (req.body.Warr_Garr) {
                let Warr_Garr = JSON.parse(req.body.Warr_Garr);
                const result = await Product.updateOne({ _id: req.params.prdID }, { $set: { Warr_Garr } })
                resultRedirect(result)
            }
            if (req.body.size) {
                let size = JSON.parse(req.body.size).divsArr
                const result = await Product.updateOne({ _id: req.params.prdID }, { $set: { size } })
                resultRedirect(result)
            }
            if (req.body.color) {
                let color = JSON.parse(req.body.color).divsArr
                const result = await Product.updateOne({ _id: req.params.prdID }, { $set: { color } })
                resultRedirect(result)
            }
            if (req.body.highlight) {
                let highlight = JSON.parse(req.body.highlight).divsArr
                const result = await Product.updateOne({ _id: req.params.prdID }, { $set: { highlight } })
                resultRedirect(result)
            }
            if (req.body.payment_ops) {
                let payment_ops = JSON.parse(req.body.payment_ops).divsArr
                const result = await Product.updateOne({ _id: req.params.prdID }, { $set: { payment_ops } })
                resultRedirect(result)
            }
            if (req.body.service) {
                let service = JSON.parse(req.body.service).divsArr
                const result = await Product.updateOne({ _id: req.params.prdID }, { $set: { service } })
                resultRedirect(result)
            }
            if (req.body.specification) {
                let specification = JSON.parse(req.body.specification)
                const result = await Product.updateOne({ _id: req.params.prdID }, { $set: { specification } })
                resultRedirect(result)
            }
        },

        async deletePrd(req, res) {
            const ifProduct = await Product.exists({ _id: req.params.prdID })
            if (ifProduct) {
                const product = await Product.findById({ _id: req.params.prdID });
                let strID = product.storeId;

                for (let i = 0; i < product.image.length; i++) {
                    // console.log(product.image[i].img);
                    let img = product.image[i].img;
                    fs.unlink(`public/uploadedImages/${img}`, (err, res) => {
                        if (err) {
                            console.log(err);
                        }
                    })
                }
                const result = await Product.findByIdAndDelete({ _id: req.params.prdID });
                if (result) {
                    return res.redirect(`/seller/store/${strID}`);
                } else {
                    return res.redirect(`/seller/productUpdate/${req.params.prdID}`);
                }
            }
        }
    }
}

module.exports = sellerProductController;