const Store = require('../../../models/store')
const Product = require('../../../models/product')
const fs = require('fs');

function storeController() {
    return {
        async index(req, res) {
            const store = await Store.exists({ sellerId: req.session.user._id })
            const storeData = await Store.find({ sellerId: req.session.user._id });

            if (store) {
                return res.render('seller/sellerStr', { store: true, storeData })
            } else {
                return res.render('seller/sellerStr', { store: false })
            }
        },

        async addStore(req, res) {
            const { storename, storeownername, storecontact, storeaddress, storedesc } = req.body

            if (!storename || !storeownername || !storecontact || !storeaddress || !storedesc) {
                req.flash('error', 'All fields are required')
                req.flash('storename', storename)
                req.flash('storeownername', storeownername)
                req.flash('storecontact', storecontact)
                req.flash('storeaddress', storeaddress)
                req.flash('storedesc', storedesc)
                return res.redirect('/seller/sellerStr')
            }

            let productPictures = [];

            if (req.files.length > 0) {
                productPictures = req.files.map((file) => {
                    return { img: file.filename };
                });
            }

            const store = new Store({
                sellerId: req.session.user._id,
                storename,
                owner: storeownername,
                phone: storecontact,
                address: storeaddress,
                description: storedesc,
                image: productPictures
            })

            store.save()
                .then((result) => {
                    return res.redirect('/seller/sellerStr')
                })
                .catch((err) => {
                    console.log(err);
                    req.flash('error', 'Something went wrong')
                    return res.redirect('/seller/sellerStr')
                })
        },

        async editStore(req, res) {
            const store = await Store.find({ _id: req.params.storeID })
            const imageSet = await Store.find({ _id: req.params.storeID }).select({ image: 1, _id: 0 })
            if (store) {
                res.render('seller/storeCust', { store, imageSet })
            }
        },

        async updateStore(req, res) {
            if (req.body.changedname) {
                const name = await Store.updateOne({ _id: req.params.storeID }, { $set: { storename: req.body.changedname } })
                if (name) {
                    res.redirect(`/seller/storeCust/${req.params.storeID}`)
                } else {
                    res.render('/')
                }
            }

            if (req.body.changedowner) {
                const name = await Store.updateOne({ _id: req.params.storeID }, { $set: { owner: req.body.changedowner } })
                if (name) {
                    res.redirect(`/seller/storeCust/${req.params.storeID}`)
                } else {
                    res.render('/')
                }
            }

            if (req.body.changedcontact) {
                const name = await Store.updateOne({ _id: req.params.storeID }, { $set: { phone: req.body.changedcontact } })
                if (name) {
                    res.redirect(`/seller/storeCust/${req.params.storeID}`)
                } else {
                    res.render('/')
                }
            }

            if (req.body.changedaddress) {
                const name = await Store.updateOne({ _id: req.params.storeID }, { $set: { address: req.body.changedaddress } })
                if (name) {
                    res.redirect(`/seller/storeCust/${req.params.storeID}`)
                } else {
                    res.render('/')
                }
            }

            if (req.body.changeddesc) {
                const name = await Store.updateOne({ _id: req.params.storeID }, { $set: { description: req.body.changeddesc } })
                if (name) {
                    res.redirect(`/seller/storeCust/${req.params.storeID}`)
                } else {
                    res.render('/')
                }
            }
        },

        async storeAddImg(req, res) {
            // const store = await Store.find({ _id: req.params.storeID })
            // let imageSet = await Store.find().select({ image: 1, _id: 0 })

            let productPictures = [];

            if (req.files.length > 0) {
                productPictures = req.files.map((file) => {
                    return { img: file.filename };
                });
            }

            const result = await Store.updateOne({ _id: req.params.storeID }, { $push: { image: { $each: productPictures } } })
                // console.log(result);
            if (result) {
                res.redirect(`/seller/storeCust/${req.params.storeID}`)
            } else {
                res.render('/')
            }
        },

        async deleteStrImage(req, res) {
            // console.log(req.params.img);
            // console.log(req.params.strID);
            let imageSet = await Store.find({ _id: req.params.strID }).select({ image: 1, _id: 0 })

            const del = await Store.updateOne({ _id: req.params.strID }, { $pull: { image: { img: req.params.img } } }, { multi: true })
                // console.log(del);
            if (del) {
                fs.unlink(`public/uploadedImages/${req.params.img}`, (err, res) => {
                    if (err) {
                        console.log(err);
                    }
                })
            }
        },

        async deleteStr(req, res) {
            //check if store is exists
            const ifStore = await Store.exists({ _id: req.params.strID });
            if (ifStore) {
                //if store is exists then delete store image from storage
                const strImg = await Store.find({ _id: req.params.strID }).select({ image: 1, _id: 0 })
                if (strImg) {
                    // console.log(strImg[0].image);
                    let imgArr = strImg[0].image;
                    imgArr.map(imgSet => {
                        // console.log(imgSet.img);
                        fs.unlink(`public/uploadedImages/${imgSet.img}`, (err, res) => {
                            if (err) {
                                console.log(err);
                            }
                        })
                    })
                }

                //check any product exists in this store
                const ifProduct = await Product.exists({ storeId: req.params.strID })
                if (ifProduct) {
                    //if product exists then delete it's images
                    const prdImg = await Product.find({ storeId: req.params.strID }).select({ image: 1, _id: 0 })
                    if (prdImg) {
                        for (let i = 0; i < prdImg.length; i++) {
                            let prdImgArr = prdImg[i].image;
                            prdImgArr.map(prdImgSet => {
                                // console.log(imgSet.img);
                                fs.unlink(`public/uploadedImages/${prdImgSet.img}`, (err, res) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                })
                            })
                        }
                    }

                    //then delete that store's product from database
                    const product = await Product.deleteMany({ storeId: req.params.strID });
                }

                //delete that store from database
                const result = await Store.findByIdAndDelete({ _id: req.params.strID });
                if (result) {
                    res.redirect('/seller/sellerStr');
                } else {
                    res.redirect(`/seller/storeCust/${req.params.strID}`)
                }
            }
        }
    }
}

module.exports = storeController;