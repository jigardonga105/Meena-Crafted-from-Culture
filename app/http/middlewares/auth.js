function auth(req, res, next) {
    if (req.session && ((req.session.user && req.session.user._id) || (req.session.courierAgents && req.session.courierAgents._id))) {
        return next();
    }
    return res.redirect('/login');
}

module.exports = auth;