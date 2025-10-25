// const User = require("../../../models/user");
const CourierAgents = require("../../../models/courierAgents");
const bcrypt = require('bcrypt')
const fs = require('fs');


function courierServiceAdminController() {
    return {
        async courierServiceAdmin(req, res) {
            let msg = req.params.msg;
            let courierAgents = await CourierAgents.find();
            // let alreadyState = [];
            // courierAgents.map(courierAgent => alreadyState.push(courierAgent.state))

            return res.render('courier/courierSection', { courierAgents, msg });
        },
        async courierServiceAdminSignupCrAg(req, res) {
            const { fname, lname, email, phone, state, password, address, pincode, city } = req.body;

            let productPictures = [];

            if (req.files.length > 0) {
                productPictures = req.files.map((file) => {
                    return { img: file.filename };
                });
            }

            //Check if email exists
            CourierAgents.exists({ email: email, role: 'courierAgent' }, (err, result) => {
                if (result) {
                    let msg = 'existed';
                    return res.redirect(`/courierSection/${msg}`)
                }
            })


            //Hash Password
            const hashPassword = await bcrypt.hash(password, 10)

            let addressObj = {
                main: address,
                pin: pincode,
                city: city,
                state: state,
            };

            let courierAgents;

            //Create a new CourierAgents
            courierAgents = new CourierAgents({
                first_name: fname,
                last_name: lname,
                email,
                phone,
                password: hashPassword,
                image: productPictures,
                address: addressObj,
                state
            })

            courierAgents.save()
                .then((courierAgents) => {
                    let msg = "created";
                    return res.redirect(`/courierSection/${msg}`)
                })
                .catch((err) => {
                    console.log(err);
                    let msg = "notCreated";
                    return res.redirect(`/courierSection/${msg}`)
                })
        },
        async deleteAge(req, res) {
            if (req.body.ageId) {
                let result = await CourierAgents.findByIdAndDelete({ _id: req.body.ageId });
                if (result) {
                    let msg = "deleted";
                    return res.redirect(`/courierSection/${msg}`)
                } else {
                    let msg = "notDeleted";
                    return res.redirect(`/courierSection/${msg}`)
                }
            }
        },
        async updateAge(req, res) {
            const { id, fname, lname, email, phone, state, address, pincode, city } = req.body;

            let addressObj = {
                main: address,
                pin: pincode,
                city: city,
                state: state,
            };

            const deleteImgFunc = async() => {
                let result = await CourierAgents.findById({ _id: id });
                if (result) {
                    for (let i = 0; i < result.image.length; i++) {
                        let img = result.image[i].img;
                        fs.unlink(`public/uploadedImages/${img}`, (err, res) => {
                            if (err) {
                                let msg = "imgNotDeleted";
                                return res.redirect(`/courierSection/${msg}`)
                            }
                        })
                    }
                }
            }

            const pictureFunc = () => {
                let productPictures = [];

                if (req.files.length > 0) {
                    productPictures = req.files.map((file) => {
                        return { img: file.filename };
                    });
                }

                return productPictures;
            };

            const redirectFunc = (result) => {
                if (result) {
                    let msg = "updated";
                    return res.redirect(`/courierSection/${msg}`)
                } else {
                    let msg = "notUpdated";
                    return res.redirect(`/courierSection/${msg}`)
                }
            };

            if (req.files.length > 0 && req.body.password) {

                deleteImgFunc();
                let img = pictureFunc();
                let pass = await bcrypt.hash(req.body.password, 10)
                let result = await CourierAgents.updateOne({ _id: id }, { $set: { first_name: fname, last_name: lname, email, phone, address: addressObj, state, image: img, password: pass } });
                redirectFunc(result);
            } else if (req.files.length > 0) {

                deleteImgFunc();
                let img = pictureFunc();
                let result = await CourierAgents.updateOne({ _id: id }, { $set: { first_name: fname, last_name: lname, email, phone, address: addressObj, state, image: img } });
                redirectFunc(result);
            } else if (req.body.password) {

                let pass = await bcrypt.hash(req.body.password, 10)
                let result = await CourierAgents.updateOne({ _id: id }, { $set: { first_name: fname, last_name: lname, email, phone, address: addressObj, state, password: pass } });
                redirectFunc(result);
            } else {

                let result = await CourierAgents.updateOne({ _id: id }, { $set: { first_name: fname, last_name: lname, email, phone, address: addressObj, state } });
                redirectFunc(result);
            }
        }
    }
}

module.exports = courierServiceAdminController