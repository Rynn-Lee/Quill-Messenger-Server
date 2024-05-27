const express = require('express')
const { registerUser, loginUser, findUser, getUsers, findUserTag, updateUser, deleteUser } = require('../Controllers/user-controller')

const userRoutes = express.Router();

userRoutes.post('/register', registerUser)
userRoutes.post('/login', loginUser)
userRoutes.post('/update', updateUser)
userRoutes.get('/find/:userId', findUser)
userRoutes.get('/findtag/:userTag', findUserTag)
userRoutes.get('/getall', getUsers)
userRoutes.get('/delete/:userId', deleteUser)

module.exports = userRoutes