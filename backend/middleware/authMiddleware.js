const { verifyToken } = require("../service/auth")
const User = require("../models/UsersModel")

async function restrictLoggedInUserOnly(req,res,next){
    const authHeader = req.headers.authorization
    
    if(!authHeader) return res.status(401).json({message: "Unauthorized"})

    const accessToken = authHeader.split(" ")[1]

    const decoded = verifyToken(accessToken)

    if(!decoded) return res.status(401).json({message: "Invalid or Expired token"})

    const isActiveUser = await User.findById(decoded._id)

    if(isActiveUser.status === "Inactive") return res.status(403).json({message: "Your account is inactive"})

    req.user = decoded
    return next()
}

function restrictTo(...allowedRoles){
    return (req,res,next)=>{
        if(!req.user){
            return res.status(401).json({message: "Unauthorized"})
        }

        if(!allowedRoles.includes(req.user.role)){
            return res.json({message: "Forbidden"})
        }
        next()
    }
}

module.exports = {
    restrictLoggedInUserOnly,
    restrictTo
}