const express = require("express")
const router = express.Router()
const {generateCoupon, validateCoupon, cancelCoupon, couponStatus, allCoupons, searchBySponsoredName} = require("../controllers/couponController")
const { restrictTo } = require("../middleware/authMiddleware")

// Generating coupons----------------------------------------------------------------------------------------

router.post('/create',restrictTo("admin"), generateCoupon)

// Validating coupons-------------------------------------------------------------------------------------------

router.post('/validate',restrictTo("admin","lab"),validateCoupon)

// Cancelling coupons ------------------------------------------------------------------------------

router.post('/cancel',restrictTo("admin"),cancelCoupon)

// Coupons Status------------------------------------------------------------------------------------------------------------------------------------------------------------

router.get('/status',restrictTo("admin"),couponStatus)

// Show all coupons----------------------------------------------------------------------------------------------------------------------------------

router.get('/',restrictTo("admin"),allCoupons)

// Search By Area----------------------------------------------------------------------------------------------------

router.post("/searchBySponsoredName",restrictTo("admin"),searchBySponsoredName)

module.exports = router