const authController = require("../app/http/controllers/authController");
const orderController = require("../app/http/controllers/customers/orderController");
const homeController = require("../app/http/controllers/homeController");
const requestController = require("../app/http/controllers/provider/requestController");
const serviceController = require("../app/http/controllers/provider/serviceController");

const guest = require('../app/http/middleware/guest')
const auth = require('../app/http/middleware/auth')
const provider = require('../app/http/middleware/provider');

const initRoutes = (app) => {
    app.get('/', homeController().index)
    app.get('/login', guest, authController().login)
    app.post('/login', authController().postLogin)
    app.get('/register', guest, authController().register)
    app.post('/register', authController().postRegister)
    app.post('/logout', authController().logout)

    // Customer routes
    app.post('/orders', auth, orderController().store)
    app.get('/customer/orders', auth, orderController().index)
    app.get('/customer/orders/:id', auth, orderController().show)
    app.post('/customer/rate', auth, orderController().rate)
    app.get('/api/provider/:id', orderController().getProvider)

    // Provider routes
    app.get('/provider/requests', provider, requestController().index)
    app.post('/provider/order/status', provider, requestController().updateStatus)
    app.get('/provider/services', provider, serviceController().index)
    app.post('/provider/services', provider, serviceController().update)
}

module.exports = initRoutes
