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
        return res.status(400).json({message: "All fields are required", type:"error"})
    }
    if(password !== confirmPassword) return res.status(400).json({message: "Confirm Password did not match", type:"error"})

    const existingUser = await User.findOne({email})
    if(existingUser){
        return res.status(400).json({message: "A user with that email already exist", type:"error"})
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

    return res.status(200).json({message: "Lab technician successfully created", type:"success"})
}

//Get all staff----------------------------------------------------------------------------------------------------------------------------------

async function getAllStaff(req,res){
    const {status} = req.query
    let filter = {}
    if(status === "All"){
        filter = {role: "lab"}
    }else if(status === "Active"){
        filter = {role: "lab", status: "Active"}
    }else if(status === "Inactive"){
        filter = {role: "lab", status: "Inactive"}
    }
    const allStaff = await User.find(filter)
    return res.status(200).json({message: "Here are all staff list", countStaff:allStaff.length ,allStaff: allStaff})
    
}

//Handle Staff Status------------------------------------------------------------------------------------------------------------------------------------

async function handleStaffStatus(req,res){
    const {id, status} = req.body

    if(status === "Active"){
        await User.findByIdAndUpdate(
            id,
            {status: "Inactive"},
            {new: true}
        )
        console.log({message: "Staff inactive"});
        return res.status(200).json({message: "Staff inactive"})
    }
    if(status === "Inactive"){
        await User.findByIdAndUpdate(
            id,
            {status: "Active"},
            {new: true}
        )
        console.log({message: "Staff active"})
        return res.status(200).json({message: "Staff active"})
    }

}

// Find Staff------------------------------------------------------------------------------------------

async function findStaff(req,res){
    const {findStaff} = req.body

    const found = await User.find({username: findStaff})
    console.log("Foud",found);
    
    if(found.length === 0) return res.status(404).json({message: "No username found"})

        console.log({message: "Username Found", foundStaff: found});
        return res.status(200).json({message: "Username Found", foundStaff: found})
        
}

// User Status Filter------------------------------------------------------------------------------------------------------------------------------------------------


module.exports = {
    handleUserSignIn,
    handleUserLogin,
    createLabTech,
    getAllStaff,
    handleStaffStatus,
    findStaff
}