const chatModel = require("../Models/chat-model")
const messageModel = require("../Models/message-model")
const userModel = require("../Models/user-model")
const md5 = require('md5')

const registerUser = async(req, res) => {
  const { usertag, password } = req.body
  if(!usertag || !password)
    return res.status(400).json({message: `Please, fill all the inputs!`})
  if(password.length < 8)
    return res.status(400).json({message: `Your password must be longer than 8 characters!`})
  if(usertag.length > 30)
    return res.status(400).json({message: `Your usertag must be no more than 30 characters long`})
  if(usertag.length < 3)
    return res.status(400).json({message: `Your usertag must contain at least 3 characters`})

  try{
    let user = await userModel.findOne({usertag: usertag})
    if(user)
      return res.status(400).json({message: "The usertag is already taken!"})
    user = new userModel({
      usertag,
      displayedName: usertag,
      avatar: "https://cdn-icons-png.flaticon.com/512/6596/6596121.png"
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
    return res.status(400).json({message: `Please, fill all the inputs!`})

  try{
    let user = await userModel.findOne({usertag: usertag})

    if(!user || md5(password) !== user.password)
      return res.status(400).json({message: "Incorrect Password or Usertag"})

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
    return res.status(400).json({message: "Invalid set of data"})
  }
  console.log(newData)
  try{
    const updated = await userModel.findByIdAndUpdate(newData._id, newData)
    res.status(200).json({...updated, ...newData})
  } catch (error) {
    console.log("An error occured on the server-side!", error)
    res.status(500).json({message: error})
  }
}

const deleteUser = async(req, res) => {
  const {userId} = req.params
  try{
    await userModel.findByIdAndDelete(userId)
    await chatModel.deleteMany({members: {$in: [userId]}})
    await messageModel.deleteMany({senderID: {$in: [userId]}})
    console.log("WIPED OUT!")
    res.status(200).json({message: 'ok!'})
  } catch (error) {
    console.log("An error occured on the server side!", error)
    res.status(500).json({message: error})
  }
}

module.exports = {registerUser, loginUser, findUser, getUsers, findUserTag, updateUser, deleteUser}