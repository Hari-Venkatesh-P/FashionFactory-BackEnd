const mongoose = require('mongoose')

const CartSchema = mongoose.Schema({
    userid: {
      type: String,
    },
    productid: {
        type: String,
    },
    quantity: {
        type: String,
    },
    orderStatus:  { 
        type: Boolean,
        default:false
        }
  })

  module.exports = mongoose.model('CartDetails', CartSchema);