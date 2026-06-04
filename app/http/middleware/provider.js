const redirectTo = '/login'
function provider(req, res, next) {
    if(req.isAuthenticated() && req.user.role === 'provider') {
        return next()
    }
    return res.redirect(redirectTo)
}
module.exports = provider
