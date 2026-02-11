const { getUser } = require("../service/auth")
const User = require("../models/UsersModel")

async function restrictLoggedInUserOnly(req,res,next){
    const userUid = req.headers["authorization"]
    if(!userUid) return res.status(401).json({message: "Unauthorized"})
    const token = userUid.split(" ")[1]
    const user = getUser(token)
    if(!user) return res.status(401).json({message: "Unauthorized"})

    const isActiveUser = User.findById(user._id)
    if(isActiveUser === "Inactive") return res.status(403).json({message: "Your account is inactive"})

    req.user = user
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