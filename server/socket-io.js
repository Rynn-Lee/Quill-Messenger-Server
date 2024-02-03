let connectedUsers = {}

const socketConnection = (http) => {
  const socketIO = require('socket.io')(http, {
    cors: {
        origin: [`http://localhost:3000`, `http://localhost:3001`, `http://localhost:19000`, `http://localhost:13131`, `http://192.168.2.100:3000`, `exp://192.168.2.100:8081`,`exp://192.168.2.100:8082`, `http://192.168.2.100:19006`, `exp://localhost:8081`, `http://localhost:19006`]
    }
  });
  
  socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    const user = socket.handshake.query._id
    if(!user){
      socket.disconnect()
      return
    }
    addId({userid: user, socketid: socket.id})

    socket.on('newMessage', (data) => {
      if(!connectedUsers[data.recipientID] || !connectedUsers[data.recipientID].length){ return }
    
      for(let i = 0; i < connectedUsers[data.recipientID].length; i++){
        socketIO.to(connectedUsers[data.recipientID][i]).emit('newMessage', data.message)
      }
    })

    socket.on('typing', (data) => {
      if(!connectedUsers[data.recipientID] || !connectedUsers[data.recipientID].length){ return }
      console.log("typing", data)
      for(let i = 0; i < connectedUsers[data.recipientID].length; i++){
        socketIO.to(connectedUsers[data.recipientID][i]).emit('typing', data)
      }
    })

    socket.on('getOnlineUsers', ()=>{
      console.log("User", socket.id, "asked for connected clients")
      socket.emit('onlineUsers', connectedUsers)
    })
  
    socket.on('disconnect', (reason) => {
      console.log('🔥: A user disconnected: ', reason);
      removeId(socket.id)
    });
  });
}

const addId = (data) => {
  if (!connectedUsers[data.userid]) {
    connectedUsers[data.userid] = [];
  }
  connectedUsers[data.userid].push(data.socketid);
  console.log("🧐 Connected users: ", connectedUsers)
}

// Function to remove an id from a user
const removeId = (id) => {
 for (let user in connectedUsers) {
    let index = connectedUsers[user].indexOf(id);
    if (index !== -1) {
      connectedUsers[user].splice(index, 1);
      break;
    }
  }
  console.log("🧐 Connected users:", connectedUsers)
}

module.exports = (http) => socketConnection(http)