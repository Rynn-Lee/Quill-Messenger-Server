const groupModel = require('../Models/group-model')

const createGroup = async(req, res) => {
  const {name, image, usersID} = req.body
  console.log("CREATE GROUP", name, image, usersID)
  try{
    const group = await groupModel.findOne({
      name, image, members: {$all: usersID}
    })
    if(group) {return res.status(200).json(group)}
    const newGroup = new groupModel({
      name, image, members: usersID
    })
    const response = await newGroup.save()
    res.status(200).json(response)
  } catch (error) {
    console.log("An error occured on the server side!", error)
    res.status(500).json({message: error})
  }
}

const findUserGroups = async(req, res) => {
  const {userID} = req.params

  try{
    const groups = await groupModel.find({
      members: {$in: [userID]}
    })
    res.status(200).json({groups})
  } catch (error) {
    console.log("An error occured on the server side!", error)
    res.status(500).json({message: error})
  }
}

const findGroups = async(req, res) => {
  const {usersID} = req.body

  try{
    const group = await groupModel.findOne({
      members: {$all: usersID}
    })
    res.status(200).json({group})
  } catch (error) {
    console.log("An error occured on the server side!", error)
    res.status(500).json({message: error})
  }
}

module.exports = {createGroup, findUserGroups, findGroups}