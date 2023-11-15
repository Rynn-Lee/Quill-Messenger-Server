const express = require('express');
const app = express();
//New imports
const http = require('http').Server(app);
const cors = require('cors');
require('dotenv').config()
require('./socket-io')(http)
const PORT = process.env.LISTENING_PORT

app.use(cors());

app.get('/api', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});