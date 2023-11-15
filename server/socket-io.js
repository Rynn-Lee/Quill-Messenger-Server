let clients = []

const socketConnection = (http) => {
  const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
  });
  
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
}

module.exports = (http) => socketConnection(http)