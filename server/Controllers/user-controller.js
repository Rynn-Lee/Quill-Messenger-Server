const chatModel = require("../Models/chat-model")
const messageModel = require("../Models/message-model")
const userModel = require("../Models/user-model")
const md5 = require('md5')
const axios = require('axios')

const registerUser = async(req, res) => {
  const { usertag, password } = req.body
  if(!usertag || !password)
    return res.status(400).json({message: `Заполните все поля!`})
  if(password.length < 8)
    return res.status(400).json({message: `Ваш пароль должен быть длинее 8 символов!`})
  if(usertag.length > 30)
    return res.status(400).json({message: `Ваш тэг должен быть меньше 30-ти символов`})
  if(usertag.length < 3)
    return res.status(400).json({message: `Ваш тэг должен быть длинее 3-х символов`})

  try{
    let user = await userModel.findOne({usertag: usertag})
    if(user)
      return res.status(400).json({message: "The usertag is already taken!"})

    const response = await axios.get("https://cdn-icons-png.flaticon.com/512/6596/6596121.png", {responseType: 'arraybuffer'})
    const base64= Buffer.from(response.data, 'binary').toString('base64')
    const formatted = `data:image/png;base64,${base64}`
    user = new userModel({
      usertag,
      displayedName: usertag,
      avatar: {
        format: 'png',
        code: formatted,
      }
    })

    user.password = md5(password)
    await user.save().then((newuser) => {user._id = newuser._id})

    res.status(200).json({_id: user._id, usertag, displayedName: usertag, avatar: user.avatar})
  } catch(error) {
    console.log("An error occured on the server-side!", error)
    res.status(500).json({message: error})
  }
}

const loginUser = async(req, res) =>{ 
  const { usertag, password } = req.body
  if(!usertag || !password)
    return res.status(400).json({message: `Зполните все поля!`})

  try{
    let user = await userModel.findOne({usertag: usertag})

    if(!user || md5(password) !== user.password)
      return res.status(400).json({message: "Неверный пароль или тэг"})

    res.status(200).json({
      _id: user._id,
      usertag,
      displayedName: user.displayedName,
      avatar: user.avatar
    })
  } catch (error) {
    console.log("An error occured on the server-side!", error)
    res.status(500).json({message: `error`})
  }
}

const findUser = async(req, res) => {
  const {userId} = req.params

  try{
    const user = await userModel.findById(userId)
    if(!user)
      return res.status(400).json({message: "Такого пользователя не найдено!"})
    res.status(200).json({
      _id: user._id,
      usertag: user.usertag,
      displayedName: user.displayedName,
      avatar: user.avatar,
      createdAt: user.createdAt
    })
  } catch (error) {
    console.log("An error occured on the server-side!", "Unsusual '_id' lenght was asked for!")
    res.status(500).json({message: "Unsusual '_id' lenght was asked for!"})
  }
}


const findUserTag = async(req, res) => {
  const {userTag} = req.params

  try{
    const user = await userModel.findOne({usertag: userTag})
    if(!user)
      return res.status(400).json({message: "No such user found!"})
    res.status(200).json({
      _id: user._id,
      usertag: user.usertag,
      displayedName: user.displayedName,
      avatar: user.avatar,
      createdAt: user.createdAt
    })
  } catch (error) {
    console.log("An error occured on the server-side!", "Unsusual '_id' lenght was asked for!")
    res.status(500).json({message: "Unsusual '_id' lenght was asked for!"})
  }
}

const getUsers = async(req, res) => {
  console.log("REQUEST!!!")
  try{
    const user = await userModel.find()
    const filtered = user && user.map((item)=>({
      _id: item._id,
      usertag: item.usertag,
      displayedName: item.displayedName,
      avatar: item.avatar,
      createdAt: item.createdAt
    }))

    res.status(200).json(filtered)
  } catch (error) {
    console.log("An error occured on the server-side!", error)
    res.status(500).json({message: error})
  }
}

const updateUser = async(req, res) => {
  const newData = req.body
  if(!newData._id){
    return res.status(403).json({message: "Недостаточно аргументов"})
  }
  try{
    const updated = await userModel.findByIdAndUpdate(newData._id, newData)
    res.status(200).json({...updated, ...newData})
  } catch (error) {
    console.log("An error occured on the server-side!", error)
    res.status(500).json({message: error})
  }
}

const changePassword = async(req, res) => {
  const {userId, oldPassword, newPassword} = req.body
  console.log("REQUEST!!!", userId, oldPassword, newPassword)
  if(!userId || !oldPassword || !newPassword)
    return res.status(400).json({message: `Заполните все поля!`})

  try{
    const user = await userModel.findById(userId)
    if(!user || md5(oldPassword) !== user.password)
      return res.status(400).json({message: "Incorrect Password!"})
    await userModel.findByIdAndUpdate(userId, {password: md5(newPassword)})
    res.status(200).json({message: 'ok!'})
  } catch (error) {
    console.log("An error occured on the server side!", error)
    res.status(500).json({message: error})
  }
}

const deleteUser = async(req, res) => {
  const {userId} = req.params
  try{
    await userModel.findByIdAndDelete(userId)
    await chatModel.deleteMany({members: {$in: [userId]}})
    await messageModel.deleteMany({senderID: {$in: [userId]}})
    res.status(200).json({message: 'ok!'})
  } catch (error) {
    console.log("An error occured on the server side!", error)
    res.status(500).json({message: error})
  }
}

const getRandomUser = async(req, res) => {
  const {userId} = req.query
  try{
    const users = await userModel.find({_id: {$ne: userId}})
    const randomUser = users[Math.floor(Math.random() * users.length)]
    res.status(200).json(randomUser)
  } catch (error) {
    console.log("An error occured on the server side!", error)
    res.status(500).json({message: error})
  }
}

module.exports = {registerUser, loginUser, findUser, getUsers, findUserTag, updateUser, deleteUser, getRandomUser, changePassword}