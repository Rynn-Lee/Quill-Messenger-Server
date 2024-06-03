const express = require('express');
const app = express();
// const http = require('http').Server(app);
const cors = require('cors');
const {createServer} = require('http')
const {Server} = require("socket.io")
const httpServer = createServer(app)
// Routes
const userRoutes = require('./Routes/user-routes');
const chatRoutes = require('./Routes/chat-routes');
const messageRoutes = require('./Routes/message-routes');
const groupRoutes = require('./Routes/group-routes');

require('./middleware/request-logger')
require('./utils/DBconnect');
require('dotenv').config()
require('./socket-io')(Server, httpServer)

// Libraries
app.use(cors());
app.use(express.json({limit: '10mb'}))
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

// Middleware
app.use("/api/user", userRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/message", messageRoutes)
app.use("/api/group", groupRoutes)

// Run the server
// http.listen(4000, () => {
//   console.log(`Server listening on ${4000}`);
// });