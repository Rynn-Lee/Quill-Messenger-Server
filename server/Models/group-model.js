const mongoose = require("mongoose")

const groupSchema = new mongoose.Schema({
  name: String,
  image: {
    format: {type: String},
    code: {type: String},
  },
  members: Array,
},{
  timestamps: true
})

const groupModel = mongoose.model("groups", groupSchema)

module.exports = groupModel