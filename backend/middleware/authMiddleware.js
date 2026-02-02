const jwt = require("jsonwebtoken")

function authMiddleware(req,res,next){

    const MYSECRETKEY = "SuperSecret"

    const authHeader = req.headers.authrization

    if(!authHeader){
        return res.json({message: "No token provided"})
    }

    const token = authHeader.split(" ")[1]

    try{
        const decode = jwt.verify(token,MYSECRETKEY)
        req.user = decode
        next()
    }catch(error){
        return res.json({message: "Invalid or token expired"})
    }
}
module.exports = authMiddleware