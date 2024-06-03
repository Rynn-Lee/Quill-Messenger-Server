const express = require('express')
const { createMessage, getMessages, getLastestMessage, removeMessage } = require('../Controllers/message-controller')

const messageRoutes = express.Router();

messageRoutes.post('/send', createMessage)
messageRoutes.get('/:chatID', getMessages)
messageRoutes.get('/findLatest/:chatID', getLastestMessage)
messageRoutes.get('/remove/:messageID', removeMessage)

module.exports = messageRoutes
