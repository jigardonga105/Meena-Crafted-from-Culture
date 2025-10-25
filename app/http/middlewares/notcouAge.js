function notcouAge(req, res, next) {
    if (req.session && req.session.user && req.session.user._id && req.session.user.role === 'courierAgent') {
        return res.redirect('/courieAgeDashBoard/index')
    }
    return next()
}

module.exports = notcouAge