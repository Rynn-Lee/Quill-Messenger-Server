const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chatID: { type: String, required: true },
  senderID: { type: String, required: true },
  type: { type: String, enum: ['text', 'media', 'media-text'], required: true },
  text: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
}, {
  timestamps: true
})

messageSchema.pre('save', function (next) {
  if (
    this.type === 'text' ||
    (this.type === 'media' && this.text && this.text.format && this.text.code) ||
    (this.type === 'media-text' && this.text && this.text.format && this.text.code && this.text.text)
  ) { next() }
  else { next(new Error('ОГУЗОК МАТЬ ТВОЮ')) }
})

const messageModel = mongoose.model('messages', messageSchema)

module.exports = messageModel