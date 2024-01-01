const { findUser } = require('./Controllers/user-controller');

const port = process.env.CLIENT_LISTEN_PORT
console.log("port:", port)

let connectedUsers = {}

const socketConnection = (http) => {
  const socketIO = require('socket.io')(http, {
    cors: {
        origin: [`http://localhost:3000`, `http://localhost:3001`, `http://localhost:19000`, `http://localhost:13131`]
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
      console.log("Data received", {...data})
      if(!connectedUsers[data.recipientID] || !connectedUsers[data.recipientID].length){ return }
      console.log("There are registered instances!", connectedUsers[data.recipientID])
      
      for(let i = 0; i < connectedUsers[data.recipientID].length; i++){
        socketIO.to(connectedUsers[data.recipientID][i]).emit('newMessage', data.message)
      }
    })

    socket.on('typing', (data) => {
      if(!connectedUsers[data.recipientID] || !connectedUsers[data.recipientID].length){ return }
      console.log("Typing for:", connectedUsers[data.recipientID])
      for(let i = 0; i < connectedUsers[data.recipientID].length; i++){
        socketIO.to(connectedUsers[data.recipientID][i]).emit('typing', data)
      }
    })

    socket.on('getOnlineUsers', ()=>{
      console.log("User", socket.id, "asked for connected clients")
      socket.emit('onlineUsers', connectedUsers)
    })
  
    socket.on('disconnect', (reason) => {
      removeId(socket.id)
      console.log('🔥: A user disconnected: ', reason);
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
  console.log("connectedUsers", connectedUsers)
}

module.exports = (http) => socketConnection(http)