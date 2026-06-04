const User = require("../../../models/user");

function serviceController() {
    return {
        index(req, res) {
            res.render('provider/services');
        },
        async update(req, res) {
            try {
                let services = req.body.services || [];
                // If it's a single service (not an array), wrap it
                if (!Array.isArray(services)) {
                    services = [services];
                }
                
                // Parse strings from frontend form
                services = services.map(s => {
                    const price = Number(s.price) || 0;
                    return {
                        name: s.name,
                        pricePerKg: s.unit === 'kg' ? price : 0,
                        pricePerItem: s.unit === 'item' ? price : 0,
                        unit: s.unit === 'kg' || s.unit === 'item' ? s.unit : 'kg'
                    };
                });
                
                await User.findByIdAndUpdate(req.user._id, { services });
                req.flash('success', 'Services updated successfully');
                return res.redirect('/provider/services');
            } catch (err) {
                console.error(err);
                req.flash('error', 'Something went wrong while updating services');
                return res.redirect('/provider/services');
            }
        }
    };
}

module.exports = serviceController;
