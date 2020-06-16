const mongoose = require('mongoose')
const SubCategory = require('./SubCategory')
const SubCategorySchema = mongoose.Schema({
  name: {
    type: String,
  },
})

const CategorySchema = mongoose.Schema({
    name: {
      type: String,
      unique : true
    },
    subcategory : [SubCategorySchema]
  })

  module.exports = mongoose.model('CategoryDetails', CategorySchema);