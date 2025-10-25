const User = require('../../../models/user')
const bcrypt = require('bcrypt');
const passport = require('passport');
const validator = require('validator');

function sellerAuthController() {

    return {
        sellerSignup(req, res) {
            res.render('auth/sellerSignup');
        },

        sellerLogin(req, res) {
            res.render('auth/sellerLogin')
        },

        async sellerSignupPost(req, res) {
            const { fname, lname, email, phone, password } = req.body

            let productPictures = [];

            if (req.files.length > 0) {
                productPictures = req.files.map((file) => {
                    return { img: file.filename };
                });
            }

            if (!fname || !lname || !email || !phone) {
                req.flash('error', 'All fields are required')
                req.flash('fname', fname)
                req.flash('lname', lname)
                req.flash('email', email)
                req.flash('phone', phone)
                return res.redirect('/sellerReg')
            }

            const isEmail = validator.isEmail(email)
            if (!isEmail) {
                req.flash('error', 'Email is not a valid')
                req.flash('fname', fname)
                req.flash('lname', lname)
                req.flash('phone', phone)
                return res.redirect('/sellerReg')
            }

            User.exists({ email: email, role: 'seller' }, (err, result) => {
                if (result) {
                    req.flash('error', 'Email already taken')
                    req.flash('fname', fname)
                    req.flash('lname', lname)
                    req.flash('phone', phone)
                    return res.redirect('/sellerReg')
                }
            })

            const hashPassword = await bcrypt.hash(password, 10)

            const user = new User({
                first_name: fname,
                last_name: lname,
                email,
                phone,
                password: hashPassword,
                role: 'seller',
                image: productPictures
            })

            user.save()
                .then((user) => {
                    req.flash('success', 'Account created. Login now!')
                    return res.redirect('/sellerLog')
                })
                .catch((error) => {
                    req.flash('error', 'Something went wrong')
                    return res.redirect('/sellerReg')
                })
        },

        async sellerLoginPost(req, res, next) {
            const { email, password } = req.body

            if (!email || !password) {
                req.flash('error', 'All fields are required')
                return res.redirect('/sellerLog')
            }

            const isEmail = validator.isEmail(email)
            if (!isEmail) {
                req.flash('error', 'Email is inValid')
                return res.redirect('/sellerLog')
            }

            const isExist = await User.count({ email: email, role: 'seller' })
            if (!isExist) {
                req.flash('error', 'Seller not found')
                return res.redirect('/sellerLog')
            }

            const user = await User.findOne({ email: email })
            if (user) {
                const result = await bcrypt.compare(password, user.password);
                if (result) {
                    if (req.session.courierAgents || req.session.user) {
                        delete req.session.courierAgents
                        delete req.session.user
                        // req.session.regenerate((err) => {
                        //     if (err) {
                        //         console.log(err);
                        //     }
                        // })
                        req.session.user = user;
                    } else {
                        req.session.user = user;
                    }

                    return res.redirect('/')
                } else {
                    req.flash('error', 'Username or password incorrect')
                    return res.redirect('/login')
                }
            } else {
                req.flash('error', 'User not found...')
                return res.redirect('/login')
            }

        }
    }

}

module.exports = sellerAuthController;