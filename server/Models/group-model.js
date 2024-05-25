const mongoose = require("mongoose")

const groupSchema = new mongoose.Schema({
  name: String,
  image: String,
  members: Array,
},{
  timestamps: true
})

const groupModel = mongoose.model("groups", groupSchema)

module.exports = groupModel