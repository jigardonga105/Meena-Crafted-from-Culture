const Product = require("../../../models/product");
const Store = require("../../../models/store");
const Users = require("../../../models/user");
const Comments = require("../../../models/comments");
const Orders = require("../../../models/order");
const fs = require('fs');
const { Console } = require("console");

function postCommentController() {
    return {
        async shopSingleComment(req, res) {
            const { commTitle, commDesc, prdID, rating } = req.body;

            // ======================================================================================
            let productPictures = [];

            if (req.files.length > 0) {
                productPictures = req.files.map((file) => {
                    return { img: file.filename };
                });
            }
            // ======================================================================================

            let rateHistory = req.session.user.rateHistory
            let isPrdAvil = false;
            let isUpdateCommDataFuncCalled = false;

            if (commTitle && commDesc && prdID && rating && req.session.user) {
                if (rating === 0) {
                    rating = 5;
                }

                // ======================================================================================
                // General Functions (Start)
                // ======================================================================================

                const updateStoreRating = async (prdData) => {

                    // console.log('updateStoreRating called');

                    let newStoreRating = 0;
                    let newStoreVote = 0;
                    let allPrdOfStore = await Product.find({ storeId: prdData.storeId }, { vote: 1, rating: 1, storeId: 1, _id: 0 });
                    allPrdOfStore.map((prd) => {
                        newStoreRating = newStoreRating + parseInt(prd.rating);
                        newStoreVote = newStoreVote + parseInt(prd.vote);
                    })
                    newStoreRating = Math.round(newStoreRating / newStoreVote);
                    await Store.updateOne({ _id: prdData.storeId }, { $set: { rating: newStoreRating } });
                }


                const updateCommData = async () => {
                    isUpdateCommDataFuncCalled = true;

                    // console.log('updateCommData called');

                    let obj = {
                        [prdID]: rating
                    }
                    req.session.user.rateHistory = { ...req.session.user.rateHistory, ...obj }

                    let prdData = await Product.findById({ _id: prdID }, { vote: 1, rating: 1, storeId: 1, _id: 0 });
                    let vote = prdData.vote + 1;

                    let allRatingsOfProduct = await Comments.find({ prdID }, { rating: 1 });
                    let all = 0;
                    allRatingsOfProduct.map(obj => all = all + obj.rating)

                    let newRating = all + parseInt(rating)
                    newRating = Math.round(newRating / vote);

                    await Product.updateOne({ _id: prdID }, { $set: { rating: newRating, vote } });

                    updateStoreRating(prdData)

                }

                // ======================================================================================
                // General Functions (End)
                // ======================================================================================

                // ======================================================================================
                if (Object.keys(rateHistory).length === 0) {
                    // console.log("When 'req.session.user.rateHistory' is empty");
                    updateCommData();
                } else {
                    // console.log("When 'req.session.user.rateHistory' is already  present");
                    for (const id in rateHistory) {
                        if (id === prdID) {
                            // console.log("User already gave rating to this product.");
                            isPrdAvil = true;
                        }
                    }
                }
                // ======================================================================================

                // ======================================================================================
                if (!isUpdateCommDataFuncCalled) {
                    // console.log('Still updateCommData *not* called');

                    if (!isPrdAvil) {
                        // console.log("Product not found");
                        updateCommData();
                    } else {
                        // console.log("Product available");
                        let prod = await Product.findById({ _id: prdID }, { vote: 1, rating: 1, storeId: 1, _id: 0 });
                        let allRatingsOfProduct = await Comments.find({ prdID }, { rating: 1 });

                        let all = 0;
                        allRatingsOfProduct.map(obj => all = all + obj.rating)

                        let oldRating = req.session.user.rateHistory[prdID]
                        let newRating = all - oldRating;
                        newRating = newRating + parseInt(rating);
                        newRating = Math.round(newRating / prod.vote)

                        req.session.user.rateHistory = {
                            [prdID]: rating
                        }
                        await Product.updateOne({ _id: prdID }, { $set: { rating: newRating } });

                        updateStoreRating(prod)
                    }

                }
                await Users.updateMany({ _id: req.session.user._id }, { $set: { rateHistory: req.session.user.rateHistory } });
                // ======================================================================================

                // ======================================================================================

                let comment;
                if (!isPrdAvil) {
                    // console.log("Product not found. So, add new comment.");

                    comment = new Comments({
                        title: commTitle,
                        desc: commDesc,
                        prdID: prdID,
                        userID: req.session.user._id,
                        image: productPictures,
                        rating
                    })

                    comment.save()
                        .then(async (result) => {
                            let msg = 'success';
                            res.redirect(`/productview/${prdID}`);
                        })
                        .catch(async (err) => {
                            let msg = 'failed';
                            res.redirect(`/productview/${prdID}`);
                        })
                } else {
                    // console.log("Product available. So, update existing comment.");

                    let imageSet = await Comments.find({ prdID, userID: req.session.user._id }).select({ image: 1, _id: 0 })
                    // console.log(imageSet[0].image.img);

                    if (imageSet[0]) {
                        imageSet[0].image.map((image, i) => {
                            if (image.img !== null) {
                                fs.unlink(`public/uploadedImages/${image.img}`, (err, res) => {
                                    if (err) {
                                        console.log('Error: ' + err);
                                    }
                                })
                            }
                        })
                    }

                    let result = await Comments.updateOne({ prdID, userID: req.session.user._id }, {
                        $set: {
                            title: commTitle,
                            desc: commDesc,
                            prdID: prdID,
                            userID: req.session.user._id,
                            image: productPictures,
                            rating
                        }
                    })
                    if (result) {
                        let msg = 'updated';
                        res.redirect(`/productview/${prdID}`);
                    } else {
                        let msg = 'notUpdated';
                        res.redirect(`/productview/${prdID}`);
                    }
                }

            } else {
                let msg = 'rem';
                res.redirect(`/productview/${prdID}`);
            }
        },
    }
}

module.exports = postCommentController