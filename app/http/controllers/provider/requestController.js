const Order = require("../../../models/order");
const moment = require('moment');

function requestController() {
    return {
        async index(req, res) {
            try {
                const orders = await Order.find({ providerId: req.user._id })
                    .populate('customerId', 'name email')
                    .sort({ createdAt: -1 });
                if (req.xhr) {
                    return res.json(orders);
                }
                res.render('provider/requests', { orders, moment });
            } catch (err) {
                return res.status(500).send(err);
            }
        },
        async updateStatus(req, res) {
            try {
                const { orderId, status } = req.body;
                const order = await Order.findOne({ _id: orderId, providerId: req.user._id });
                if (!order) return res.status(403).json({ error: 'Not allowed' });
                order.status = status;
                await order.save();
                const eventEmitter = req.app.get('eventEmitter');
                eventEmitter.emit('orderUpdated', { id: orderId, status });
                return res.json({ success: true });
            } catch (err) {
                return res.status(500).json({ error: 'Something went wrong' });
            }
        }
    };
}
module.exports = requestController;
