const jwt = require("jsonwebtoken")

const SECRET = process.env.JWT_SECRET

function generaetAccessToken(user){
    return jwt.sign({
        _id: user._id,
        role: user.role
    },SECRET, {expiresIn: "2m"})
}

function generateRefreshToken(user){
    return jwt.sign({
        _id: user._id,
        role: user.role,
        username: user.username
    },SECRET,{expiresIn: "10s"})
}

function verifyToken(token){
    if(!token) return null
    try {
        return jwt.verify(token, SECRET)
    } catch (error) {
        return null
    }
}
module.exports = {
    generaetAccessToken,
    generateRefreshToken,
    verifyToken
}