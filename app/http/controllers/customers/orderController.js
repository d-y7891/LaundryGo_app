const Order = require("../../../models/order");
const User = require("../../../models/user");
const moment = require('moment');

function orderController() {
    return {
        async store(req, res) {
            const { providerId, phone, address, pickupDate, specialInstructions, paymentType, items } = req.body;
            if (!providerId || !phone || !address || !items) {
                req.flash('error', 'All fields are required');
                return res.redirect('/');
            }
            try {
                const parsedItems = JSON.parse(items);
                let totalPrice = 0;
                const orderItems = parsedItems.map(item => {
                    const subtotal = item.quantity * item.pricePerUnit;
                    totalPrice += subtotal;
                    return { ...item, subtotal };
                });

                const order = new Order({
                    customerId: req.user._id,
                    providerId,
                    items: orderItems,
                    totalPrice,
                    phone,
                    address,
                    pickupDate,
                    specialInstructions,
                    paymentType: paymentType || 'COD'
                });
                const result = await order.save();
                const eventEmitter = req.app.get('eventEmitter');
                eventEmitter.emit('orderPlaced', { orderId: result._id, providerId });
                req.flash('success', 'Request placed successfully!');
                return res.redirect('/customer/orders');
            } catch (err) {
                console.error(err);
                req.flash('error', 'Something went wrong');
                return res.redirect('/');
            }
        },
        async index(req, res) {
            const orders = await Order.find({ customerId: req.user._id }, null, { sort: { 'createdAt': -1 } })
                .populate('providerId', 'name businessName');
            res.header('Cache-Control', 'no-store');
            res.render('customers/orders', { orders, moment });
        },
        async show(req, res) {
            const order = await Order.findById(req.params.id)
                .populate('providerId', 'name businessName phone address');
            if (!order || req.user._id.toString() !== order.customerId.toString()) {
                return res.redirect('/');
            }
            res.render('customers/singleOrder', { order });
        },
        async rate(req, res) {
            const { orderId, rating, review } = req.body;
            try {
                const order = await Order.findById(orderId);
                if (!order || order.customerId.toString() !== req.user._id.toString() || order.status !== 'completed') {
                    return res.status(403).json({ error: 'Not allowed' });
                }
                order.rating = rating;
                order.review = review;
                await order.save();
                // Update provider rating
                const provider = await User.findById(order.providerId);
                const newTotal = (provider.rating * provider.ratingCount) + parseInt(rating);
                provider.ratingCount += 1;
                provider.rating = +(newTotal / provider.ratingCount).toFixed(1);
                await provider.save();
                return res.json({ success: true });
            } catch (err) {
                return res.status(500).json({ error: 'Something went wrong' });
            }
        },
        async getProvider(req, res) {
            try {
                const provider = await User.findById(req.params.id).select('-password');
                return res.json(provider);
            } catch (err) {
                return res.status(500).json({ error: 'Not found' });
            }
        }
    };
}
module.exports = orderController;
