function couAge(req, res, next) {
    if (req.session && req.session.courierAgents && req.session.courierAgents._id && req.session.courierAgents.role === 'courierAgent') {
        return next()
    }
    return res.redirect('/')
}

module.exports = couAge