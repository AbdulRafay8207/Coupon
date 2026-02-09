const express = require("express")
const router = express.Router()
const {handleUserSignIn, handleUserLogin, createLabTech, getAllStaff, handleStaffStatus, findStaff} = require("../controllers/userController")
const { restrictLoggedInUserOnly, restrictTo } = require("../middleware/authMiddleware")

router.post('/signup',handleUserSignIn)
router.post('/login',handleUserLogin)
router.post('/create-lab',restrictLoggedInUserOnly,restrictTo("admin"),createLabTech)
router.get('/staff-list',restrictLoggedInUserOnly,restrictTo("admin"),getAllStaff)
router.post('/staff-status',restrictLoggedInUserOnly,restrictTo("admin"),handleStaffStatus)
router.post('/find-staff',restrictLoggedInUserOnly,restrictTo("admin"), findStaff)

module.exports = router