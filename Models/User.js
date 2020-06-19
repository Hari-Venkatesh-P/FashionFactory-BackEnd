const mongoose = require('mongoose')


const bcrypt = require('bcrypt');


const UserSchema = mongoose.Schema({
    name: {
      type: String,
    },
    email: {
        type: String,
        
    },
    address: {
        type: String,
    },
    mobile:  { 
        type: Number,
        },
    password: {
        type: String,
    },
    role: {
        type: String,
        default:'USER'
    },
  })

  UserSchema.pre("save", function(next) {
    if(!this.isModified("password")) {
        return next();
    }
    this.password = bcrypt.hashSync(this.password, 10);
    next();
  });
  

  module.exports = mongoose.model('UserDetails', UserSchema);