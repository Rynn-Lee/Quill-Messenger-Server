const messageModel = require("../Models/message-model")

const createMessage = async(req, res) => {
  const {chatID, senderID, type, text} = req.body
  let result
  if (type === 'text') { result = text }
  else if (type === 'media') {
    result = {
      format: text.format,
      code: text.code,
    }
  } else if (type === 'media-text') {
    result = {
      format: text.format,
      code: text.code,
      text: text.text,
    }
  }
  const message = new messageModel({chatID, senderID, type, text: result})
  try{
    const response = await message.save()
    res.status(200).json({_id: response.id, chatID, senderID, type, text, createdAt: response.createdAt, updatedAt: response.updatedAt})
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
    const messages = await messageModel.find({chatID}).sort({_id:-1})
    res.status(200).json(messages)
  } catch (error) {
    console.log("An error occured on the server side!", error)
    res.status(500).json({message: error})
  }
}

const removeMessage = async(req, res) => {
  const {messageID} = req.params
  try{
    const response = await messageModel.findByIdAndDelete(messageID)
    res.status(200).json(response)
  } catch (error) {
    console.log("An error occured on the server side!", error)
    res.status(500).json({message: error})
  }
}

module.exports = {createMessage, getMessages, getLastestMessage, removeMessage}