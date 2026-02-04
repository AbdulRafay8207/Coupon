const express = require("express")
const router = express.Router()
const {handleUserSignIn, handleUserLogin, createLabTech} = require("../controllers/userController")
const { restrictLoggedInUserOnly, restrictTo } = require("../middleware/authMiddleware")

router.post('/signup',handleUserSignIn)
router.post('/login',handleUserLogin)
router.post('/create-lab',restrictLoggedInUserOnly,restrictTo("admin"),createLabTech)

module.exports = router