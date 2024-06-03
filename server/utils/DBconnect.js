const mongoose = require('mongoose')

// const url = 'mongodb://localhost:27017/quill-messenger'
const url = 'mongodb+srv://DiplomaDB:123123123123@diplomacluster.cshxctx.mongodb.net/?retryWrites=true&w=majority&appName=DiplomaCluster'

mongoose.connect(url).then(()=>{
  console.log("MONGO DB: Connected to database!")
}).catch((error)=>{
  console.log("MONOG DB:", error)
})  

module.exports = mongoose