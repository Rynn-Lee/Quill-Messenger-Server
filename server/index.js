const express = require('express');
const app = express();
const http = require('http').Server(app);
const cors = require('cors');

// Routes
const userRoutes = require('./Routes/user-routes');
const chatRoutes = require('./Routes/chat-routes');
const groupRoutes = require('./Routes/group-routes');
const messageRoutes = require('./Routes/message-routes');

require('./utils/DBconnect');
require('dotenv').config()
require('./socket-io')(http)

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
app.use("/api/group", groupRoutes)
app.use("/api/message", messageRoutes)

// Run the server
http.listen(4000, () => {
  console.log(`Server listening on ${4000}`);
});