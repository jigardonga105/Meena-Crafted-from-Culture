const User = require('../../models/user');
const Token = require('../../models/token');
// const otpGenerator = require('otp-generator')
const fs = require('fs');
const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const client = require('twilio')(accountSid, authToken);
const sendEmail = require('../../helper/sendEmail');
const CourierAgents = require('../../models/courierAgents');
const bcrypt = require('bcrypt')
const { sign, verify } = require('jsonwebtoken')


const jwtSign = async (payload) => {
    try {
        return sign(payload, process.env.COOKIE_SECRET, { expiresIn: '1d' });
    } catch (error) {
        if (error instanceof HttpException) {
            throw error
        }
        throw new InternalServerErrorException('Error while creating new token')
    }
}

const jwtVerify = async (token) => {
    try {
        return verify(token, process.env.COOKIE_SECRET);
    } catch (error) {
        return error
    }
}

function myAccountController() {
    return {
        async index(req, res) {
            return res.render('myAcc');
        },

        async otp(req, res) {

            // console.log(req.body.phoneNumber);
            let phoneNumber = req.body.phoneNumber;

            // let otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
            let otp = Math.floor(100000 + Math.random() * 900000)
            // console.log(otp);

            client.messages
                .create({
                    body: `${otp} is your One Time Password for change Phone Number in Meena.`,
                    from: '+17208939563',
                    to: '+919624233580'
                    // to: '+91' + phoneNumber //Trial accounts cannot send messages to unverified numbers;
                    //verify  at twilio.com/user/account/phone-numbers/verified, or purchase a Twilio number to send messages to unverified numbers.
                })
                .then(message => {
                    // console.log(message.sid);
                    res.send(otp);
                })
                .catch(err => {
                    console.log(err);
                    res.send('We are facing some essuse. Please try again later 🙏');
                });
        },

        async changeMyAcc(req, res) {
            function sendErr(res) {
                res.send('We are facing some essuse. Please try again later 🙏');
            }


            if (req.body.fname && req.body.lname && req.body.gender) {

                const result = await User.updateOne({ _id: req.body.userID }, { $set: { first_name: req.body.fname, last_name: req.body.lname, gender: req.body.gender } })
                // console.log(result);
                if (result) {
                    const user = await User.findById({ _id: req.body.userID })
                    req.session.user = user
                    res.send(user);
                } else {
                    sendErr(res)
                }
            }
            if (req.body.email) {

                const result = await User.updateOne({ _id: req.body.userID }, { $set: { email: req.body.email } })
                // console.log(result);
                if (result) {
                    const user = await User.findById({ _id: req.body.userID })
                    req.session.user = user
                    res.send(user);
                } else {
                    sendErr(res)
                }
            }
            if (req.body.phoneNumber) {
                let phoneNumber = req.body.phoneNumber;
                let userID = req.body.userID;

                const result = await User.updateOne({ _id: userID }, { $set: { phone: phoneNumber } })
                // console.log(result);
                if (result) {
                    const user = await User.findById({ _id: userID })
                    req.session.user = user
                    res.send(user);
                } else {
                    sendErr(res)
                }
            }
            if (req.files) {
                let productPictures = [];

                if (req.files.length > 0) {
                    productPictures = req.files.map((file) => {
                        return { img: file.filename };
                    });
                }

                const user = await User.findById({ _id: req.body.userID });
                for (let i = 0; i < user.image.length; i++) {
                    // console.log(user.image[i].img);
                    let img = user.image[i].img;
                    fs.unlink(`public/uploadedImages/${img}`, (err, res) => {
                        if (err) {
                            console.log(err);
                        }
                    })
                }

                const result = await User.updateOne({ _id: req.body.userID }, { $set: { image: productPictures } }, { new: true })
                if (result) {
                    req.session.user = result
                    res.redirect(`/myAccount`)
                } else {
                    res.redirect('/myAccount?unsuccessfull')
                }
            }
            if (req.body.address) {
                // console.log(req.body.address);
                const result = await User.updateOne({ _id: req.body.userID }, { $push: { address: req.body.address } });
                // console.log(result);
                if (result) {
                    const user = await User.findById({ _id: req.body.userID })
                    req.session.user = user
                    res.send(user);
                } else {
                    sendErr(res)
                }
            }
            if (req.body.editAddressData) {

                let userID = req.body.userID
                let address = req.body.editAddressData
                let editKey = req.body.editKey

                const result = await User.updateOne({ _id: userID }, {
                    $set: {
                        [`address.${editKey}`]: address
                    }
                });
                if (result) {
                    const user = await User.findById({ _id: req.body.userID });
                    req.session.user = user
                    res.send(user);
                } else {
                    sendErr(res)
                }

            }
            if (req.body.delAddress) {
                let address = req.body.delAddress;
                const result = await User.updateOne({ _id: req.body.userID }, {
                    $pull: {
                        address: {
                            "add-name": address['add-name'],
                            "add-phone": address['add-phone'],
                            "add-pin": address['add-pin'],
                            "add-locality": address['add-locality'],
                            "add-area&street": address['add-area&street'],
                            "add-city": address['add-city'],
                            "add-state": address['add-state'],
                            "add-type": address['add-type'],
                        }
                    }
                });
                if (result) {
                    const user = await User.findById({ _id: req.body.userID })
                    req.session.user = user
                    res.send(user);
                } else {
                    sendErr(res)
                }
            }
        },

        async forgetPasswordRender(req, res) {
            try {
                return res.render('auth/emailForForPass')
            } catch (error) {
                console.log(error)
                return res.redirect('/')
            }
        },

        async forgetPassword(req, res) {
            try {

                const { email } = req.body

                if (email) {
                    let account = await User.findOne({ email: email })
                    if (account && account._id) {

                        let url
                        let accId = account._id
                        let jwtSignPayload = {}

                        jwtSignPayload = {
                            accId: accId,
                            email: email,
                        }

                        const jwtToken = await jwtSign(jwtSignPayload)
                        if (jwtToken) {
                            let jwtTokenDocPayload = new Token({
                                token: jwtToken,
                                accId: accId,
                            })

                            jwtTokenDocPayload.save()

                            url = `http://localhost:8000/resetpassword/${accId}/${jwtToken}`
                        }

                        let payload = {
                            email: email,
                            subject: 'Meena - Forget Password',
                            html: `<link rel="preconnect" href="https://fonts.googleapis.com">
                                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                                    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap" rel="stylesheet">
                                    <style>
                                        * {
                                            font-family: 'Poppins', sans-serif;
                                        }
                                    </style>
                                    <div style="padding: 15px 25px;">
                                        <h5>Thank you for being a part of Meena.</h5>
                                
                                        <h2>We have received a request to change your password.</h2>
                                        <p><a href="${url}">Here</a> is an option to set new password</p>
                                        <div style="display: grid; justify-content: center;">
                                            <a href="${url}" target="_blank"><button style="padding: 15px 20px; background-color: #3aebf4; border-color: #3aebf4; border-radius: 5px; cursor: pointer;">Reset Password</button></a>
                                        </div>
                                    </div>`
                        }
                        await sendEmail(payload)

                        return res.redirect('/login')

                    } else {
                        req.flash('error', 'User not found!')
                        return res.redirect('/forgetPassword')
                    }
                } else {
                    req.flash('error', 'Email is required!')
                    return res.redirect('/forgetPassword')
                }
            } catch (error) {
                console.log(error)
                return res.redirect('/')
            }
        },

        async verifyResetPasswordLink(req, res) {
            try {
                const { accId, jwtToken } = req.params

                const decodedData = await jwtVerify(jwtToken)
                const tokenData = await Token.findOne({ token: jwtToken })
                if (decodedData.accId && decodedData.email && tokenData && tokenData._id) {

                    if (decodedData.accId == accId) {
                        let type = 'reset'
                        let email = decodedData.email

                        await Token.findByIdAndDelete(tokenData._id)

                        return res.render('auth/updatePassword', { type, email })

                    } else {
                        console.log("error: ", 'Invalid credentials!')
                        return res.redirect('/')
                    }

                } else {
                    return res.redirect('/')
                }

            } catch (error) {
                console.log(error)
                return res.redirect('/')
            }
        },

        async updatePasswordGet(req, res) {
            try {
                let type = 'update'
                let email = req.session.user ? req.session.user.email : req.session.courierAgents ? req.session.courierAgents.email : undefined

                if (email) {
                    return res.render('auth/updatePassword', { type, email })
                } else {
                    return res.redirect('/')
                }

            } catch (error) {
                console.log(error)
                return res.redirect(`/`)
            }
        },

        async updatePassword(req, res) {
            try {
                const { email, oldPass, newPass, newConfirmPass, type } = req.body
                if (newPass !== newConfirmPass) {
                    req.flash('error', 'Password does not matched!')
                    return res.redirect(`/`)
                }

                let account
                let account2
                let Collection

                account = await User.findOne({ email: email })
                if (account && account._id) {
                    Collection = User
                } else {
                    account2 = await CourierAgents.findOne({ email: email })
                    if (account && account._id) {
                        account = account2
                        Collection = CourierAgents
                    } else {
                        req.flash('error', 'User not found!')
                        return res.redirect(`/`)
                    }
                }

                if (type == 'update') {
                    const result = await bcrypt.compare(oldPass, account.password);
                    if (!result) {
                        req.flash('error', 'Old Password is incorrect!')
                        return res.redirect(`/`)
                    }
                }

                if (account && account._id) {
                    const hashPassword = await bcrypt.hash(newPass, 10)
                    const response = await Collection.findByIdAndUpdate(account._id, {
                        password: hashPassword
                    }, { new: true })

                    if (response && response._id) {
                        if (req.session) {
                            req.session.destroy((err) => {
                                if (err) {
                                    console.log(err);
                                }
                            });
                        }
                        return res.redirect('/login')
                    } else {
                        req.flash('error', 'Internal error!')
                        return res.redirect(`/`)
                    }
                }
            } catch (error) {
                console.log(error)
                req.flash('error', 'Server error!')
                return res.redirect(`/`)
            }
        },
    }
}

module.exports = myAccountController;