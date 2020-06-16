const mongoose = require('mongoose')

const SubCategorySchema = mongoose.Schema({
  name: {
    type: String,
  },
})

module.exports = mongoose.model('SubCategoryDetails', SubCategorySchema);