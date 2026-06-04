const User = require("../../models/user")

function homeController(){
    return{
        async index(req , res){
            if (req.user && req.user.role === 'provider') {
                return res.redirect('/provider/requests');
            }
            const providers = await User.find({ role: 'provider', isAvailable: true })
                .select('-password')
                .sort({ rating: -1 })
            return res.render('home' , { providers })
        }
    }
}
module.exports = homeController
