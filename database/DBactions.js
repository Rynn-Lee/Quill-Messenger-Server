const DBactions = (client, collectionName) => {
  const collection = client.collection(collectionName)

  const addUser = async(query) => {
    if(!query.usertag || !query.password){console.log("user and password"); return {message: "Usertag and Password are required!", status: 400}}
    const isUserExist = await findUser(query.usertag)
    if(isUserExist){console.log("exist"); return {message: "User Already Exists", status: 400}}

    const result = await collection.insertOne({
      usertag: query.usertag,
      password: query.password,
      displayedName: query.usertag,
      lastOnline: false,
    }, (err, result) => {
      if(err){errorLog(err); throw new Error(err)}
      return {message: "success"}
    })

    return result
  }

  const login = async(query) => {
    if(!query.usertag || !query.password){return {message: "Usertag and Password are required!", status: 400}}
    const result = await findUser(query.usertag)
    if(!result){console.log("doesn't exist"); return {message: "User doesn't exist!", status: 400}}
    console.log(query.password, result.password)
    if(query.password != result.password){return {message: "Incorrect password!", status: 403}}
    return result
  }

  const findUser = async(usertag) => {
    const result = await collection.findOne({'usertag': `${usertag}`})
    if(!result){return null}
    return result
  }

  return {addUser, login}
}

const errorLog = (err) => {
  console.error(err)
}

module.exports = DBactions