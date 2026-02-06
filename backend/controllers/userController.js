const User = require("../models/UsersModel")
const {setUser} = require("../service/auth")

async function handleUserSignIn(req,res){
    const {username, email, password,confirmPassword} = req.body
    await User.create({
        username,
        email,
        password,
        confirmPassword,
    })
    return res.json({message: "Successfully Signin"})
}

async function handleUserLogin(req,res){
    const { email, password} = req.body
    const user = await User.findOne({email, password})
    if(!user){
        return res.json({message: "Invalid username or password",user: user})
    }
    const token = setUser(user)
    
    return res.json({message: "Login successfuly",uid: token})
}

async function createLabTech(req,res){
    const {username, password, email} = req.body
    if(!username || !password || !email){
        return res.status(400).json({message: "All fields are required"})
    }

    const existingUser = await User.findOne({email})
    if(existingUser){
        return res.status(400).json({message: "User already exist"})
    }
    
    await User.create({
        username,
        password,
        email,
        role: "lab"
    })

    return res.status(200).json({message: "Lab technician successfully created"})
}

module.exports = {
    handleUserSignIn,
    handleUserLogin,
    createLabTech
}