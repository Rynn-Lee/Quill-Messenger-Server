const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  usertag: {type: String, required: true, minlength: 3, maxlength: 30, unique: true},
  password: {type: String, required: true, minlength: 8, maxlength: 50},
  displayedName: {type: String, required: true, minlength: 3, maxlength: 30},
  avatar: {
    format: {type: String},
    code: {type: String},
  }
}, {
  timestamps: true
})

const userModel = mongoose.model("users", userSchema)

module.exports = userModel