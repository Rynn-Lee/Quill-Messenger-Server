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

    socket.on('connectDevice', (data) => {
      console.log("Connected user data", data)
      addId({usertag: data.usertag, _id: socket.id})
    })

    socket.on('getConnectedUsers', ()=>{
      console.log("User", socket.id, "asked for connected clients")
      socket.emit('connectedUsers', connectedUsers)
    })
  
    socket.on('disconnect', (reason) => {
      removeId(socket.id)
      console.log('🔥: A user disconnected: ', reason);
    });
  });
}

const addId = (data) => {
  if (!connectedUsers[data.usertag]) {
    connectedUsers[data.usertag] = [];
  }
  connectedUsers[data.usertag].push(data._id);
  console.log("connectedUsers", connectedUsers)
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