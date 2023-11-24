const express = require('express');
const app = express();
const http = require('http').Server(app);
const cors = require('cors');
const client = require('../database/DBconnect').db('quill-messenger');
const dbaction = require('../database/DBactions')
const bodyParser = require('body-parser')
require('dotenv').config()
require('./socket-io')(http)

const accountCollection = client.collection('accounts')

// Additional libraries
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// POST requests
app.post('/newUser', async (req, res) => {
  const reqBody = req.body
  const result = await dbaction(client, 'accounts').addUser(reqBody)
  res.status(result.status ? result.status : 200).json({ message: result })
})

// GET requests
app.get('/login', async(req, res) => {
  const query = req.query
  const result = await dbaction(client, 'accounts').login(query)
  res.status(result.status ? result.status : 200).json({ message: result })
})

// Run the server
http.listen(4000, () => {
  console.log(`Server listening on ${4000}`);
});