const mongoose = require('mongoose')

const CartSchema = mongoose.Schema({
    userid: {
      type: String,
    },
    productid: {
        type: String,
    },
    quantity: {
        type: Number,
    },
    price: {
        type: Number,
    },
    orderStatus:  { 
        type: Boolean,
        default:false
        },
    paymentStatus:{
        type: Boolean,
        default:false,
    },
    date : {
        type:Date,
        default:new Date(),
    }
  })

  module.exports = mongoose.model('CartDetails', CartSchema);