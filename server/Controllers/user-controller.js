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
      lastOnline: Date.now(),
      isOnline: false
    })

    user.password = md5(password)

    await user.save()

    res.status(200).json({usertag, displayedName: usertag, lastOnline: Date.now(), isOnline: false})
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
      usertag,
      displayedName: usertag,
      lastOnline: Date.now(),
      isOnline: false
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
      usertag: user.usertag,
      displayedName: user.displayedName,
      lastOnline: user.lastOnline,
      isOnline: user.isOnline
    })
  } catch (error) {
    console.log("An error occured on the server-side!", "Unsusual '_id' lenght was asked for!")
    res.status(500).json({message: "Unsusual '_id' lenght was asked for!"})
  }
}

const getUsers = async(req, res) => {
  try{
    const user = await userModel.find()
    const filtered = user && user.map((item)=>({
      usertag: item.usertag,
      displayedName: item.displayedName,
      lastOnline: item.lastOnline,
      isOnline: item.isOnline
    }))

    res.status(200).json(filtered)
  } catch (error) {
    console.log("An error occured on the server-side!", error)
    res.status(500).json({message: error})
  }
}



module.exports = {registerUser, loginUser, findUser, getUsers}