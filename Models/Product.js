const mongoose = require('mongoose')

const ProductSchema = mongoose.Schema({
    name: {
      type: String,
    },
    description:{
        type: String,
    },
    price: {
        type: Number,
    },
    imageId: {
        type: String,
        default:""
    },
    availableQuantity: {
        type: Number,
    },
    categoryId: {
        type: String,
    },
    subcategoryId: {
        type: String,
    }

  })

  module.exports = mongoose.model('ProductDetails', ProductSchema);