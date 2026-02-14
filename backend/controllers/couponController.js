const coupon = require("../models/CouponsModel")


// Generating coupons----------------------------------------------------------------------------------------

async function generateCoupon(req, res) {
    const { discountValue, validFrom, validTo, discountType, services, quantity, sponsoredName, tokenSequence } = req.body
    if (!discountValue || !sponsoredName || !validFrom || !validTo || !discountType || !services || !quantity || !tokenSequence) {
        return res.send({ message: "all fields are required!", type: "error" })
    }

    if (discountType === "service" && (services.length === 0 || services.every(s => s.trim() === ""))) {
        return res.status(400).json({ message: "Please add service list", type: "error" })
    }
    function generateSecretCode(length = 14) {
        let result = ""
        const randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        for (let i = 0; i < length; i++) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length))
        }
        return result.toUpperCase()
    }

    const coupons = []

    for (let i = 0; i < quantity; i++) {
        let exist = true
        let couponSecret;
        while (exist) {
            couponSecret = generateSecretCode()
            exist = await coupon.exists({ secret: couponSecret })
        }
        coupons.push({
            token: `${tokenSequence}-${String(i + 1).padStart(4, "0")}`,
            secret: couponSecret,
            discountValue: discountValue,
            discountType: discountType,
            services: services,
            sponsoredName: sponsoredName,
            validFrom: validFrom,
            validTo: validTo,
            isUsed: false,
            isCancelled: false,
            usedAt: ""
        })
    }
    const result = await coupon.insertMany(coupons)

    console.log({ message: "Successfully created", resut: result });
    return res.status(200).json({ message: "Successfully created", type: "success", coupon: result })
}

// Validating coupons-------------------------------------------------------------------------------------------

async function validateCoupon(req, res) {
    const {  secret } = req.body
    const filteredCoupon = await coupon.findOne({secret})


    if (!filteredCoupon) {
        console.log({ message: "Invalid Coupon" });
        return res.json({ message: "Invalid Coupon", type:"error",scannedCoupon: filteredCoupon  })
    }
    if (filteredCoupon.isCancelled) {
        console.log({ message: "Your Coupon is cancelled" });
        return res.json({ message: "Your Coupon is cancelled", type:"error",scannedCoupon: filteredCoupon  })

    }
    if (filteredCoupon.isUsed) {
        console.log({ message: "Coupon is already used" });
        return res.json({ message: "Coupon is already used", type:"error",scannedCoupon: filteredCoupon })
    }
    const today = new Date()
    const fromData = new Date(filteredCoupon.validFrom)
    const toData = new Date(filteredCoupon.validTo)
    if (today > toData) {
        console.log({ message: "Coupon is expired" });
        return res.json({ message: "Coupon is expired", type:"error",scannedCoupon: filteredCoupon  })
    }

    console.log("filtered coupon", filteredCoupon);
    
    return res.json({
        message: "Scanned coupon result",
        type: "success",
        scannedCoupon: filteredCoupon
    })
}

//Redeem Coupon------------------------------------------------------------------------------------------------------------

async function redeemCoupon(req,res) {
    const {id} = req.body
    const searchCoupon = await coupon.findById(id)

    if (!searchCoupon) {
        return res.json({ message: "Invalid Coupon", type:"error"})
    }
    if (searchCoupon.isCancelled) {
        return res.json({ message: "Your Coupon is cancelled", type:"error" })

    }
    if (searchCoupon.isUsed) {
        return res.json({ message: "Coupon is already used", type:"error"})
    }

    searchCoupon.isUsed = true
    searchCoupon.usedAt = new Date()
    searchCoupon.usedBy = req.user._id
    searchCoupon.save()

    return res.json({message: "Redeem successfully", type:"success"})

}

// Cancelling coupons ------------------------------------------------------------------------------

async function cancelCoupon(req, res) {
    const allCoupon = await coupon.find({})
    const { secret, sponsoredName } = req.body

    if (secret) {
        const coupon = allCoupon.find(c => secret === c.secret)
        if (!coupon) {
            return res.json({ message: "Coupon not found" })
        }
        coupon.isCancelled = true
        await coupon.save()

        console.log({ message: `Coupon ${secret} is successfully cancelled` });
        return res.json({ message: `Coupon ${secret} is successfully cancelled` })
    }
    if(sponsoredName){
        const coupons = await coupon.updateMany({
            sponsoredName: sponsoredName, isUsed: false, isCancelled: false, validTo: {$gte: new Date()} 
        },
        {$set: {isCancelled: true}}
        )
        return res.status(200).json({message:`All Coupons of ${sponsoredName} successfully cancelled`})
    }

}

// Coupons Status------------------------------------------------------------Need to maintain---------------------------------------------------------------------

async function couponStatus(req, res) {
    const { type } = req.query
    const today = new Date()
    let filter = {}

    if (type === "all") {
        filter = {}
    } else if (type === "active") {
        filter = {
            validTo: { $gte: today },
            isCancelled: false,
            isUsed: false
        }
    } else if (type === "expired") {
        filter = {
            validTo: { $lt: today },
            isCancelled: false,
            isUsed: false
        }
    } else if (type === "cancelled") {
        filter = {
            isCancelled: true,
        }
    } else if (type === "used") {
        filter = {
            isUsed: true
        }
    } else {
        return res.json({ message: "Invalid Type" })
    }
    const coupons = await coupon.find(filter)
    return res.json({
        status: type,
        count: coupons.length,
        coupon: coupons
    })
}

async function testCouponStatus(req, res) {
    const today = new Date()
    try {
        let summary = await coupon.aggregate([
            {
                $group: {
                    _id: "$sponsoredName",

                    discountType: { $first: "$discountType" },
                    discountValue: { $first: "$discountValue" },
                    validFrom: { $first: "$validFrom" },
                    validTo: { $first: "$validTo" },

                    services: {
                        $first: {
                            $cond: [
                                { $eq: ["$discountType", "service"] },
                                "$services",
                                []
                            ]
                        }
                    },

                    totalCoupons: { $sum: 1 },

                    usedCoupons: {
                        $sum: { $cond: ["$isUsed", 1, 0] }
                    },

                    cancelledCoupons: {
                        $sum: { $cond: ["$isCancelled", 1, 0] }
                    },

                    expiredCoupons: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $lt: ["$validTo", today] },
                                        { $eq: ["$isUsed", false] },
                                        { $eq: ["$isCancelled", false] }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    }
                }
            }
        ])
        return res.json({
        count: summary.length,
        summary: summary
        })
    } catch (error) {
        console.log("Error in aggregate", error);
    }
    return res.json({message: "something wrong"})
}

// Show all coupons---------------------------------------------------CHANGE NEED-----------------------------------------------------------------------------

async function allCoupons(req, res) {
    const allCoupon = await coupon.find({})
    res.json({ message: "Here are all cards ", count: allCoupon.length, coupon: allCoupon })
}

//Sponsored Details--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

async function sponsoredDetails(req,res) {
    const {sponsoredName, type, search} = req.query
    const today = new Date()

    let filter = {}
    if(sponsoredName){
        filter.sponsoredName = sponsoredName
    } 

    if (type === "active") {
        filter.isCancelled = false
        filter.isUsed = false
        filter.validTo = { $gte: today }
    } else if (type === "expired") {
        filter.isCancelled = false
        filter.isUsed = false
        filter.validTo = { $lt: today }
    } else if (type === "cancelled") {
        filter.isCancelled = true
    } else if (type === "used") {
        filter.isUsed = true
    }

    if(search){
        filter.secret = {
            $regex: "^" + search,
            $options: "i"   
        }
    }
    
    const sponsoredCoupons = await coupon.find(filter)

    return res.status(200).json({message: "Sponsored Details", sponsoredDetails: sponsoredCoupons})
}


// Search By Secret------------------------------------------------------------------------------------------------------------------------------------------------------

async function findCouponBySecret(req, res) {
    const { secret, status } = req.body
    if (!secret) return res.status(400).json({ message: "Enter Secret" })
    const today = new Date()
    let filter = {
        secret: secret
    }
    if (status === "active") {
        filter.isCancelled = false
        filter.isUsed = false
        filter.validTo = { $gte: today }
    } else if (status === "expired") {
        filter.isCancelled = false
        filter.isUsed = false
        filter.validTo = { $lt: today }
    } else if (status === "cancelled") {
        filter.isCancelled = true
    } else if (status === "used") {
        filter.isUsed = true
    }

    const findCouponBySecret = await coupon.find(filter)

    if (findCouponBySecret.length === 0) return res.status(400).json({ message: "No Coupon found" })
    res.json({ message: "Found Sponsored Name", couponBySecret: findCouponBySecret })
}

// Delete Sponsored------------------------------------------------------------------------------------------------------------------------

async function deleteSponsored(req,res) {
    const {sponsoredName} = req.body
    await coupon.deleteMany({sponsoredName})
    return res.status(200).json({message: "Sponsored Deleted"})

}

// Lab Staff Dashboard----------------------------------------------------------------------------------------

async function labStaffDashboard(req,res){
    console.log("piece of human shit");
    
    const userId = req.user._id
    console.log("THIS IS USER ID", userId);
    
    const {from ,to} = req.query

    let filter = {
        usedBy: userId,
        isUsed: true
    }
    if(from && to){
        const start = new Date(from)
        start.setHours(0,0,0,0)

        const end = new Date(to)
        end.setHours(23,59,59,999)
        filter.usedAt = {
            $gte: start,
            $lte: end
        }
    }

    const coupons = await coupon.find(filter).select("token sponsoredName discountValue usedAt validFrom validTo")

    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)


    const todayCount = await coupon.countDocuments({
        usedBy: userId,
        isUsed: true,
        usedAt: { $gte: startOfToday }
    })

    return res.json({
        totalScans: coupons.length,
        todayScans: todayCount,
        scans: coupons
    })
}

module.exports = {
    generateCoupon,
    validateCoupon,
    cancelCoupon,
    couponStatus,
    allCoupons,
    findCouponBySecret,
    testCouponStatus,
    sponsoredDetails,
    deleteSponsored,
    labStaffDashboard,
    redeemCoupon
}