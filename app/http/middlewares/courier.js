function courier(req, res, next) {
    if (req.session && req.session.user && req.session.user._id && req.session.user.role === 'courier') {
        return next()
    }
    return res.redirect('/')
}

module.exports = courier