require('dotenv').config()

const express = require('express');
const app = express();
const PORT = process.env.LISTENING_PORT
//New imports
const http = require('http').Server(app);
const cors = require('cors');

let clients = []

app.use(cors());

const socketIO = require('socket.io')(http, {
  cors: {
      origin: "http://localhost:3000"
  }
});

//Add this before the app.get() block
socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  clients.push(socket.id)

  socket.on('getConnectedUsers', ()=>{
    console.log("User", socket.id, "asked for connected clients")
    socket.emit('connectedUsers', clients)
  })

  socket.on('disconnectAll', ()=>{
    socketIO.sockets.sockets.map((user)=>{
      user.di
    })
  })

  socket.on('disconnect', (reason) => {
    clients = clients.filter((id) => id != socket.id)
    console.log('🔥: A user disconnected: ', reason);
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});