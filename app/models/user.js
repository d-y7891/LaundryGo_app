const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {type:String , required:true},
    email: {type:String , required:true , unique:true},
    password: {type:String , required:true},
    role: {type:String , default:'customer', enum:['customer','provider']},
    // Provider-specific fields
    businessName: {type:String},
    description: {type:String},
    phone: {type:String},
    address: {type:String},
    rating: {type:Number , default:0},
    totalRatings: {type:Number , default:0},
    ratingCount: {type:Number , default:0},
    services: [{
        name: {type:String},       // e.g. "Wash & Fold", "Dry Clean"
        pricePerKg: {type:Number}, // price per kg
        pricePerItem: {type:Number}, // price per item (for special items)
        unit: {type:String, default:'kg', enum:['kg','item']}
    }],
    isAvailable: {type:Boolean , default:true},
} , {timestamps:true})

const User = mongoose.model('User' , userSchema)
module.exports = User
