const mongoose = require('mongoose')

const url = 'mongodb://localhost:27017/quill-messenger'

mongoose.connect(url).then(()=>{
  console.log("MONGO DB: Connected to database!")
}).catch((error)=>{
  console.log("MONOG DB:", error)
})  

module.exports = mongoose