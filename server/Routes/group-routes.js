const express = require('express')
const { createGroup, findUserGroups, findGroups } = require('../Controllers/group-controller')

const groupRoutes = express.Router();

groupRoutes.post('/create', createGroup)
groupRoutes.get('/:userID', findUserGroups)
groupRoutes.get('/find/:userID', findGroups)

module.exports = groupRoutes
