const { MongoClient } = require('mongodb')

const url = 'mongodb://localhost:27017'

const client = new MongoClient(url)

client.connect((err) => {
  if(err){
    console.error('An error occured while connecting to the database', err);
    return;
  }
  console.log('connected to mongodb')

  client.close();
})

module.exports = client