const { getUser } = require("../service/auth")

async function restrictLoggedInUserOnly(req,res,next){
    const userUid = req.headers["authorization"]
    if(!userUid) return res.status(401).json({message: "Unauthorized"})
    const token = userUid.split(" ")[1]
    const user = getUser(token)
    if(!user) return res.status(401).json({message: "Unauthorized"})
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