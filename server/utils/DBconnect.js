const mongoose = require('mongoose')
require('dotenv').config()
const url = process.env.DB_CONNECT

mongoose.connect(url).then(()=>{
  console.log("MONGO DB: Connected to database!")
}).catch((error)=>{
  console.log("MONOG DB:", error)
})  

module.exports = mongoose