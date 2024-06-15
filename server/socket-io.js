let connectedUsers = {}

const socketConnection = (http) => {
  const socketIO = require('socket.io')(http, {
    cors: {
        // origin: [`https://quill-messenger-server.onrender.com:4000`]
        origin: [`http://0.0.0.0:3000`, 'http://0.0.0.0:3001',`http://localhost:3000`, `http://localhost:3001`, `http://localhost:3002`,`http://localhost:19000`, `http://localhost:13131`, `http://192.168.2.100:3000`,  `http://192.168.2.100:3001`, `ws://192.168.2.100:3000`, `ws://192.168.2.100:3001`,`exp://192.168.2.100:8081`,`exp://192.168.2.100:8082`, `http://192.168.2.100:19006`, `exp://localhost:8081`, `http://localhost:19006`, `http://26.214.103.206:3000`, `http://26.214.103.206:4000`, `http://26.214.103.206:8081`]
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
      if(!data?.recipientID?.length){ return }
      for(let i = 0; i < data.recipientID.length; i++){
        if (!connectedUsers[data.recipientID[i]]) { continue }
        for(let j = 0; j < connectedUsers[data.recipientID[i]].length; j++){
          socketIO.to(connectedUsers[data.recipientID[i]][j]).emit('newMessage', data.message)
        }
      }
    })

    socket.on('removeMessage', (data) => {
      if(!data.messageID){ return }
      console.log("removeMessage", data)
      for(let i = 0; i < data.recipientID.length; i++){
        if (!connectedUsers[data.recipientID[i]]) { continue }
        for(let j = 0; j < connectedUsers[data.recipientID[i]].length; j++){
          socketIO.to(connectedUsers[data.recipientID[i]][j]).emit('removeMessage', {chatID: data.chatID, _id: data.messageID})
        }
      }
    })

    socket.on('createGroup', (data) => {
      if(!data?.recipientID?.length){ return }
      for(let i = 0; i < data.recipientID.length; i++){
        if (!connectedUsers[data.recipientID[i]]) { continue }
        for(let j = 0; j < connectedUsers[data.recipientID[i]].length; j++){
          socketIO.to(connectedUsers[data.recipientID[i]][j]).emit('addGroup', data.data)
        }
      }
    })

    socket.on('typing', (data) => {
      if(!data?.recipientID?.length){ return }
      console.log("Typing", data)
      for(let i = 0; i < data.recipientID.length; i++){
        if (!connectedUsers[data.recipientID[i]]) { continue }
        for(let j = 0; j < connectedUsers[data.recipientID[i]].length; j++){
          socketIO.to(connectedUsers[data.recipientID[i]][j]).emit('typing', data)
        }
      }
    })

    socket.on('getOnlineUsers', ()=>{
      console.log("User", socket.id, "asked for connected clients")
      socket.emit('onlineUsers', connectedUsers)
    })

    socket.on('removeChat', (data) => {
      console.log("REMOVE CHAT", data)
      if(!data.recipientID?.length){ return }
      for(let i = 0; i < data.recipientID.length; i++){
        if (!connectedUsers[data.recipientID[i]]) { continue }
        for(let j = 0; j < connectedUsers[data.recipientID[i]].length; j++){
          console.log('removing chat for', data.recipientID[i])
          socketIO.to(connectedUsers[data.recipientID[i]][j]).emit('removeChat', {chatID: data.chatID})
        }
      }
    })
  
    socket.on('userDeleted', (data) => {
      console.log("userDeleted", data)
      socket.broadcast.emit('userDeleted', data)
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