const express = require('express')
const { registerUser, loginUser, findUser, getUsers } = require('../Controllers/user-controller')

module.exports = function(client) {
  const userRoutes = express.Router();

  userRoutes.post('/register', registerUser)
  userRoutes.post('/login', loginUser)
  userRoutes.get('/find/:userId', findUser)
  userRoutes.get('/getall', getUsers)

  return userRoutes;
}