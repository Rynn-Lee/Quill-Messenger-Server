const express = require('express')
const { createMessage, getMessages, getLastestMessage } = require('../Controllers/message-controller')

const messageRoutes = express.Router();

messageRoutes.post('/send', createMessage)
messageRoutes.get('/:chatID', getMessages)
messageRoutes.get('/findLatest/:chatID', getLastestMessage)

module.exports = messageRoutes
