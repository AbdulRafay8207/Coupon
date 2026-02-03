const User = require("../models/UsersModel")

async function handleUserSignIn(req,res){
    const {username, email, password} = req.body
    await User.create({
        username,
        email,
        password
    })
    return res.json({message: "Successfully Signin"})
}

async function handleUserLogin(req,res){
    const { email, password} = req.body
    const user = await User.findOne({email, password})
    if(!user){
        return res.json({message: "Invalid username or password",user: user})
    }
    return res.json({message: "Login successfuly"})
}
   

module.exports = {
    handleUserSignIn,
    handleUserLogin
}