const messageModel = require("../Models/message-model")

const createMessage = async(req, res) => {
  const {chatID, senderID, text} = req.body
  const message = new messageModel({
    chatID, senderID, text
  })
  try{
    const response = await message.save()
    res.status(200).json({_id: response.id, chatID, senderID, text, createdAt: response.createdAt, updatedAt: response.updatedAt})
  } catch (error) {
    console.log("An error occured on the server side!", error)
    res.status(500).json({message: error})
  }
}

const getMessages = async(req, res) => {
  const {chatID} = req.params
  try{
    const messages = await messageModel.find({chatID})
    res.status(200).json(messages)
  } catch (error) {
    console.log("An error occured on the server side!", error)
    res.status(500).json({message: error})
  }
}

const getLastestMessage = async(req, res) => {
  const {chatID} = req.params
  try{
    const messages = await messageModel.find({chatID}).sort({_id:-1}).limit(30)
    res.status(200).json(messages)
  } catch (error) {
    console.log("An error occured on the server side!", error)
    res.status(500).json({message: error})
  }
}

module.exports = {createMessage, getMessages, getLastestMessage}