function isAdmin(req) {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return true
    }
    return false
}

function isCustomer(req) {
    if (req.session && req.session.user && req.session.user.role === 'customer') {
        return true
    }
    return false
}

function isSeller(req) {
    if (req.session && req.session.user && req.session.user.role === 'seller') {
        return true
    }
    return false
}

function isCourierServiceAdmin(req) {
    if (req.session && req.session.user && req.session.user.role === 'courier') {
        return true
    }
    return false
}

function isCourierAgent(req) {
    if (req.session && req.session.courierAgents && req.session.courierAgents.role === 'courierAgent') {
        return true
    }
    return false
}

function isGuest(req) {
    if (req.session && (req.session.user || req.session.courierAgents)) {
        if (!req.session.user._id || !req.session.courierAgents._id) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}

function isAuthenticated(req) {
    if (req.session && ((req.session.user && req.session.user._id) || (req.session.courierAgents && req.session.courierAgents._id))) {
        return true
    }
    return false
}

module.exports = {
    isAdmin,
    isCustomer,
    isSeller,
    isCourierServiceAdmin,
    isCourierAgent,
    isGuest,
    isAuthenticated
}