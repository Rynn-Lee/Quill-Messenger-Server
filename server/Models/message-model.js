const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  chatID: String,
  senderID: String,
  text: String
},{
  timestamps: true
})

const messageModel = new mongoose.model('messages', messageSchema)

module.exports = messageModel