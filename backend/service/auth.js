const jwt = require("jsonwebtoken")

const SECRET = process.env.JWT_SECRET

function generaetAccessToken(user){
    return jwt.sign({
        _id: user._id,
        role: user.role
    },SECRET, {expiresIn: "15m"})
}

function generateRefreshToken(user){
    return jwt.sign({
        _id: user._id,
        role: user.role
    },SECRET,{expiresIn: "1h"})
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