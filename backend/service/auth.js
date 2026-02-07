const jwt = require("jsonwebtoken")

const SECRET = "MYSECRETKEY"
function setUser(user){
    return jwt.sign({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
    },SECRET)
}
function getUser(token){
    if(!token) return null
    try {
        return jwt.verify(token, SECRET)
    } catch (error) {
        return null
    }
}
module.exports = {
    setUser,
    getUser
}