const express = require('express')
const { createGroup, findUserGroups, findGroups, deleteGroup, editGroup } = require('../Controllers/group-controller')

const groupRoutes = express.Router();

groupRoutes.post('/create', createGroup)
groupRoutes.post('/edit/:groupID', editGroup)
groupRoutes.get('/delete/:groupID', deleteGroup)
groupRoutes.get('/:userID', findUserGroups)
groupRoutes.get('/find/:userID', findGroups)

module.exports = groupRoutes