const chatModel = require('../Models/chat-model')
const messageModel = require('../Models/message-model')

const createChat = async(req, res) => {
  const {firstID, secondID} = req.body

  try{
    const chat = await chatModel.findOne({
      members: {$all: [firstID, secondID]}
    })

    if(chat) {return res.status(200).json(chat)}
    const newChat = new chatModel({
      members: [firstID, secondID]
    })

    const response = await newChat.save()
    res.status(200).json(response)

  } catch (error) {
    console.log("An error occured on the server side!", error)
    res.status(500).json({message: error})
  }
}

const findUserChats = async(req, res) => {
  const {userID} = req.params

  try{
    const chats = await chatModel.find({
      members: {$in: [userID]}
    })
    res.status(200).json({chats})
  } catch (error) {
    console.log("An error occured on the server side!", error)
    res.status(500).json({message: error})
  }
}

const findChat = async(req, res) => {
  const {firstID, secondID} = req.body

  try{
    const chat = await chatModel.findOne({
      members: {$all: [firstID, secondID]}
    })
    res.status(200).json({chat})
  } catch (error) {
    console.log("An error occured on the server side!", error)
    res.status(500).json({message: error})
  }
}

const removeChat = async(req, res) => {
  const {chatID} = req.params
  try{
    console.log("Deleting dis shit")
    await chatModel.findByIdAndDelete(chatID)
    await messageModel.deleteMany({chatID})
    res.status(200).json({message: 'ok!'})
  } catch (error) {
    console.log("An error occured on the server side!", error)
    res.status(500).json({message: error})
  }
}
module.exports = {createChat, findUserChats, findChat, removeChat}