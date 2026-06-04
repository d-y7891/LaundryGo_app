const mongoose = require('mongoose')

const Schema = mongoose.Schema

const orderSchema = new Schema({
    customerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    providerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    items: [{
        serviceName: {type:String, required:true},
        quantity: {type:Number, required:true},
        unit: {type:String, required:true},   // 'kg' or 'item'
        pricePerUnit: {type:Number, required:true},
        subtotal: {type:Number, required:true}
    }],
    totalPrice: {type:Number, required:true},
    phone: {type:String , required:true},
    address: {type:String , required:true},
    pickupDate: {type:String},
    specialInstructions: {type:String},
    paymentType: {type:String , default:'COD'},
    status: {type:String , default:'request_placed', enum:['request_placed','confirmed','picked_up','washing','ready','delivered','completed','cancelled']},
    // Rating after completion
    rating: {type:Number},
    review: {type:String}
} , {timestamps:true})

const Order = mongoose.model('Order' , orderSchema)
module.exports = Order
