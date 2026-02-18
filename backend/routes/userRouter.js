const express = require("express")
const router = express.Router()
const {handleUserSignIn, handleUserLogin, createLabTech, getStaffByStatus, handleStaffStatus, findStaff, editStaff, getStaffById, logoutUser, refreshAccessToken} = require("../controllers/userController")
const { restrictLoggedInUserOnly, restrictTo } = require("../middleware/authMiddleware")

router.post('/signup',handleUserSignIn)
router.post('/login',handleUserLogin)
router.post('/create-lab',restrictLoggedInUserOnly,restrictTo("admin"),createLabTech)
router.get('/staff-list',restrictLoggedInUserOnly,restrictTo("admin"),getStaffByStatus)
router.post('/staff-status',restrictLoggedInUserOnly,restrictTo("admin"),handleStaffStatus)
router.post('/find-staff',restrictLoggedInUserOnly,restrictTo("admin"), findStaff)
router.put('/edit-staff/:id',restrictLoggedInUserOnly, restrictTo("admin"), editStaff)
router.get("/staff/:id", restrictLoggedInUserOnly, restrictTo("admin"), getStaffById)
router.post('/logout',logoutUser)
router.post('/refresh', refreshAccessToken)

module.exports = router