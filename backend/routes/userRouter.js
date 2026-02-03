const express = require("express")
const router = express.Router()
const {handleUserSignIn, handleUserLogin} = require("../controllers/userController")

router.post('/signup',handleUserSignIn)
router.post('/login',handleUserLogin)

// router.get("/signup",(req,res)=>{
//     return res.json({message: "Signup Page"})
// })

module.exports = router