const User = require("../models/UsersModel")
const {setUser} = require("../service/auth")
const bcrypt = require("bcrypt")


// Handle Signin--------------------------------------------------------------------------------------------------------------

async function handleUserSignIn(req,res){
    const {username, email, password,confirmPassword, contactNumber} = req.body
    if(password !== confirmPassword) return res.status(400).json({message: "Confirm password did not match"})
    const isExist = await User.find({email})
    console.log("Already exist",isExist);
    if(isExist.length > 0) return res.status(400).json({message: "A user with this email already exist"})
    

    const hashedPassoword = await bcrypt.hash(password,10)
    try {
        await User.create({
            username,
            email,
            password: hashedPassoword,
            branchName: "Head Office",
            contactNumber,
            role: "admin"
        })
        return res.json({message: "Successfully Signin"})
    } catch (error) {
        console.log("error in handleUserSignin function",error);
        return res.json({message: "Something went wrong"})
    }
}

// Handle Login------------------------------------------------------------------------------------------------------------------------------------------

async function handleUserLogin(req,res){
    const { email, password} = req.body
    const user = await User.findOne({email})
    if(!user){
        return res.json({message: "Invalid email or password"})
    }
    const isMatch = await bcrypt.compare(password, user.password)
    
    if(!isMatch){
        return res.json({message: "Invalid email or password"})
    }

    if(user.status === "Inactive") return res.json({message: "Your account is inactive. Contact Admin"})

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
    
    const hashedPassoword = await bcrypt.hash(password,10)
    
    await User.create({
        username,
        email,
        branchName,
        contactNumber,
        password: hashedPassoword,
        role: "lab"
    })

    return res.status(200).json({message: "Lab technician successfully created", type:"success"})
}

//Get Staff By Status----------------------------------------------------------------------------------------------------------------------------------

async function getStaffByStatus(req,res){
    const {status, search} = req.query
    let filter = {role: "lab"}
    
    if(status === "Active"){
        filter.status = "Active"
    }else if(status === "Inactive"){
        filter.status = "Inactive"
    }
    
    if(search){
        filter.username = {
            $regex: "^" + search,
            $options: "i"   
        }
    }
    const allStaff = await User.find(filter).select("-password")
    return res.status(200).json({message: "Here are all staff list", countStaff:allStaff.length ,allStaff: allStaff})
    
}

//Handle Staff Status------------------------------------------------------------------------------------------------------------------------------------

async function handleStaffStatus(req,res){
    const {id, status} = req.body

    if (!id || !status) {
        return res.status(400).json({ message: "Missing id or status" })
    }

        await User.findByIdAndUpdate(
            id,
            {status},
            {new: true}
        )
        console.log({message: `Staff ${status}`})
        return res.status(200).json({message: `Staff ${status}`})
    

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

// Edit Staff------------------------------------------------------------------------------------------------------------------------------------------------

async function editStaff(req,res){
    const {id} = req.params
    const { username, email, branchName, contactNumber, password } = req.body

    const updateData = {
        username,
        email,
        branchName,
        contactNumber
    }

    if(password && password.trim() !== ""){
        const hashedPassoword = await bcrypt.hash(password,10)
        updateData.password = hashedPassoword
    }

    await User.findByIdAndUpdate(
        id,
        updateData,
        {new: true}
    ).select("-password")

    return res.status(200).json({message: "Staff updated successfuly",type: "success"})

}   

// Get Staff by ID--------------------------------------------------------------------------------------------------------------

async function getStaffById(req, res) {
  const { id } = req.params

  const staff = await User.findById(id).select("-password")

  if (!staff) {
    return res.status(404).json({ message: "Staff not found" })
  }

  res.status(200).json({ staff })
}


module.exports = {
    handleUserSignIn,
    handleUserLogin,
    createLabTech,
    getStaffByStatus,
    handleStaffStatus,
    findStaff,
    editStaff,
    getStaffById
}