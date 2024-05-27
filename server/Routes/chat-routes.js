const express = require('express')
const { createChat, findChat, findUserChats, removeChat } = require('../Controllers/chat-controller')

const chatRoutes = express.Router();

chatRoutes.post('/create', createChat)
chatRoutes.get('/:userID', findUserChats)
chatRoutes.get('/find/:firstID/:secondID', findChat)
chatRoutes.get('/delete/:chatID', removeChat)

module.exports = chatRoutes
