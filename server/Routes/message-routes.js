const express = require('express')
const { createMessage, getMessages } = require('../Controllers/message-controller')

const messageRoutes = express.Router();

messageRoutes.post('/send', createMessage)
messageRoutes.get('/:chatID', getMessages)

module.exports = messageRoutes
