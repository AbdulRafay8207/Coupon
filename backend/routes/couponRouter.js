const express = require("express")
const router = express.Router()
const {generateCoupon, validateCoupon, cancelCoupon, couponStatus, allCoupons} = require("../controllers/couponController")

// Generating coupons----------------------------------------------------------------------------------------

router.post('/create', generateCoupon)

// Validating coupons-------------------------------------------------------------------------------------------

router.post('/validate',validateCoupon)

// Cancelling coupons ------------------------------------------------------------------------------

router.post('/cancel',cancelCoupon)

// Coupons Status------------------------------------------------------------------------------------------------------------------------------------------------------------

router.get('/status',couponStatus)

// Show all coupons----------------------------------------------------------------------------------------------------------------------------------

router.get('/',allCoupons)

module.exports = router