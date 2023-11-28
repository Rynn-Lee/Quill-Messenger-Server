const express = require('express');
const app = express();
const http = require('http').Server(app);
const cors = require('cors');
const client = require('./utils/DBconnect');

// Routes
const userRoutes = require('./Routes/user-routes')(client);

require('dotenv').config()
require('./socket-io')(http)

// Libraries
app.use(cors());
app.use(express.json());

// Middleware
app.use("/api/user", userRoutes)

// Run the server
http.listen(4000, () => {
  console.log(`Server listening on ${4000}`);
});