const express = require('express')
const { registerUser, loginUser, findUser, getUsers, findUserTag, updateUser, deleteUser, getRandomUser, changePassword } = require('../Controllers/user-controller')

const userRoutes = express.Router();

userRoutes.post('/register', registerUser)
userRoutes.post('/login', loginUser)
userRoutes.post('/update', updateUser)
userRoutes.get('/find/:userId', findUser)
userRoutes.get('/findtag/:userTag', findUserTag)
userRoutes.get('/getall', getUsers)
userRoutes.get('/delete/:userId', deleteUser)
userRoutes.get('/randomuser', getRandomUser)
userRoutes.post('/changePassword', changePassword)

module.exports = userRoutes