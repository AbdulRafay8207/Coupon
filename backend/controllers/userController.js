const User = require("../models/UsersModel")
const {setUser} = require("../service/auth")

// Handle Signin--------------------------------------------------------------------------------------------------------------

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

// Handle Login------------------------------------------------------------------------------------------------------------------------------------------

async function handleUserLogin(req,res){
    const { email, password} = req.body
    const user = await User.findOne({email, password})
    if(!user){
        return res.json({message: "Invalid username or password",user: user})
    }
    const token = setUser(user)
    
    return res.json({message: "Login successfuly",uid: token})
}

// Add Lab Staff-----------------------------------------------------------------------------------------------------------------------

async function createLabTech(req,res){
    const {username, email, branchName, contactNumber, password, confirmPassword} = req.body
    if(!username || !password || !email){
        return res.status(400).json({message: "All fields are required"})
    }
    if(password !== confirmPassword) return res.status(400).json({message: "Confirm Password did not match"})

    const existingUser = await User.findOne({email})
    if(existingUser){
        return res.status(400).json({message: "User already exist"})
    }
    
    await User.create({
        username,
        email,
        branchName,
        contactNumber,
        password,
        confirmPassword,
        role: "lab"
    })

    return res.status(200).json({message: "Lab technician successfully created"})
}

//Get all staff----------------------------------------------------------------------------------------------------------------------------------

async function getAllStaff(req,res){
    const allStaff = User.find({role: "lab"})
    return res.status(200).json({message: "Here are all staff list", countStaff:allStaff.length ,allStaff: allStaff})
    
}

module.exports = {
    handleUserSignIn,
    handleUserLogin,
    createLabTech,
    getAllStaff
}