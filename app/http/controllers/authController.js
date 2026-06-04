const Passport = require("passport");
const User = require("../../models/user");
const bcrypt = require('bcrypt')

function authController(){
    const _getRedirectUrl = (req) => {
        return req.user.role === 'provider' ? '/provider/requests' : '/customer/orders'
    }
    return{
        login(req , res){
            res.render('auth/login')
        },
        postLogin(req , res, next){
            Passport.authenticate('local' , (err , user, info) => {
                if(err){ req.flash('error' , info.message) }
                if(!user){
                    req.flash('error' , info.message)
                    return res.redirect('/login')
                }
                req.logIn(user , (err) => {
                    if(err){
                        req.flash('error' , info.message)
                        return next(err)
                    }
                    return res.redirect(_getRedirectUrl(req))
                })
            })(req , res , next)
        },
        register(req , res){
            res.render('auth/register')
        },
        async postRegister(req, res) {
            const { name, email, password, role, businessName, description, phone, address } = req.body;
            if (!name || !email || !password) {
                req.flash('error', 'All fields are required');
                return res.redirect('/register');
            }
            try {
                const existingUser = await User.exists({ email: email });
                if (existingUser) {
                    req.flash('error', 'Email already taken');
                    return res.redirect('/register');
                }
                const hashedPassword = await bcrypt.hash(password, 10);
                const userData = {
                    name, email, password: hashedPassword,
                    role: role || 'customer'
                };
                if (role === 'provider') {
                    userData.businessName = businessName || name;
                    userData.description = description || '';
                    userData.phone = phone || '';
                    userData.address = address || '';
                    // Default services for new providers
                    userData.services = [
                        { name: 'Wash & Fold', pricePerKg: 50, unit: 'kg' },
                        { name: 'Dry Cleaning', pricePerItem: 150, unit: 'item' },
                        { name: 'Ironing', pricePerItem: 20, unit: 'item' }
                    ];
                }
                const user = new User(userData);
                await user.save();
                return res.redirect('/login');
            } catch (err) {
                console.error(err);
                req.flash('error', 'Something went wrong');
                return res.redirect('/register');
            }
        },
        logout(req, res, next) {
            req.logout((err) => {
                if (err) return next(err);
                return res.redirect('/login');
            });
        }
    }
}
module.exports = authController
