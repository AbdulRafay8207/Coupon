const express = require("express")
const router = express.Router()
const {generateCoupon, validateCoupon, cancelCoupon, couponStatus, allCoupons, findCouponBySecret, testCouponStatus, sponsoredDetails} = require("../controllers/couponController")
const { restrictTo, restrictLoggedInUserOnly } = require("../middleware/authMiddleware")

// Generating coupons----------------------------------------------------------------------------------------

router.post('/create',restrictLoggedInUserOnly,restrictTo("admin"), generateCoupon)

// Validating coupons-------------------------------------------------------------------------------------------

router.post('/validate',restrictLoggedInUserOnly, restrictTo("admin","lab"),validateCoupon)

// Cancelling coupons ------------------------------------------------------------------------------

router.post('/cancel',restrictLoggedInUserOnly, restrictTo("admin"),cancelCoupon)

// Coupons Status------------------------------------------------------------------------------------------------------------------------------------------------------------

router.get('/status',restrictLoggedInUserOnly, restrictTo("admin"),couponStatus)

router.get('/testStatus',restrictLoggedInUserOnly, restrictTo("admin"),testCouponStatus)

// Show all coupons----------------------------------------------------------------------------------------------------------------------------------

router.get('/',restrictLoggedInUserOnly, restrictTo("admin"),allCoupons)

// Search By Area----------------------------------------------------------------------------------------------------

router.post("/findCouponBySecret",restrictLoggedInUserOnly, restrictTo("admin"),findCouponBySecret)

//Sponsored Detail-------------------------------------------------------------------------------------------------------------------------

router.get('/sponsored-details',restrictLoggedInUserOnly, restrictTo("admin"),sponsoredDetails)

module.exports = router