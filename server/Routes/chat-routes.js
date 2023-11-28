const express = require('express')
const { createChat, findChat, findUserChats } = require('../Controllers/chat-controller')

const chatRoutes = express.Router();

chatRoutes.post('/create', createChat)
chatRoutes.get('/:userID', findUserChats)
chatRoutes.get('/find/:firstID/:secondID', findChat)

module.exports = chatRoutes
