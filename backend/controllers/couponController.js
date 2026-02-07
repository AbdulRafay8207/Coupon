const coupon = require("../models/CouponsModel")

// Generating coupons----------------------------------------------------------------------------------------

async function generateCoupon(req,res) {
    const {discountValue, validFrom, validTo, discountType, services, quantity, sponsoredName, tokenSequence} = req.body
    if(!discountValue || !sponsoredName || !validFrom || !validTo || !discountType || !services || !quantity || !tokenSequence){
        return res.send({message: "all fields are required!"})
    }

    if(discountType === "service" && (services.length === 0 || services.every(s => s.trim() === ""))){
        return res.status(400).json({message: "Please add service list"})
    }
    function generateSecretCode(length = 14){
        let result = ""
        const randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        for(let i=0; i<length; i++){
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length))
        }
        return result.toUpperCase()
    }

    const coupons = []

    for(let i = 0; i < quantity; i++){
        let exist = true
        let couponSecret;
        while(exist){
            couponSecret = generateSecretCode()
            exist = await coupon.exists({secret: couponSecret})
        }
        coupons.push({
        token: `${tokenSequence}-${String(i + 1).padStart(4,"0")}`,
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

    console.log({message: "Successfully created", resut: result});
    return res.status(200).json({message: "Successfully created", coupon: result})
}

// Validating coupons-------------------------------------------------------------------------------------------

async function validateCoupon(req,res) {
    const {id,token,secret} = req.body
    const allCoupons = await coupon.find({})
    const filteredCoupon = allCoupons.find(c => c._id.toString() === id || (c.token === token && c.secret === secret))


    if(!filteredCoupon){
        console.log({message: "Invalid Coupon"});
        return res.json({message: "Invalid Coupon"})
    }
    if(filteredCoupon.isCancelled){
        console.log({message: "Your Coupon is cancelled"});
        return res.json({message: "Your Coupon is cancelled"})
        
    }
    if(filteredCoupon.isUsed){
        console.log({message: "Coupon is already used"});
        return res.json({message: "Coupon is already used"})
    }
    const today = new Date()
    const fromData = new Date(filteredCoupon.validFrom)
    const toData = new Date(filteredCoupon.validTo)
    if(today > toData){
        console.log({message: "Coupon is expired"});
        return res.json({message: "Coupon is expired"})
    }
    filteredCoupon.isUsed = true
    filteredCoupon.usedAt = new Date()
    filteredCoupon.save()
    console.log({
        message: "Coupon successfully applied",
        discountValue: filteredCoupon.discountValue
    });
    
    return res.json({
        message: "Coupon successfully applied",
        discountValue: filteredCoupon.discountValue
    })
}

// Cancelling coupons ------------------------------------------------------------------------------

async function cancelCoupon(req,res) {
    const allCoupon = await coupon.find({})
    const { secret, sponsoredName } = req.body

    if(secret){
        const coupon = allCoupon.find(c => secret === c.secret)
        if(!coupon){
            return res.json({message: "Coupon not found"})
        }
        coupon.isCancelled = true
        await coupon.save()

        console.log({message: `Coupon ${secret} is successfully cancelled`});
        return res.json({message: `Coupon ${secret} is successfully cancelled`})
    }

    if(sponsoredName){
        const sponsoredNameCoupon = await coupon.find({sponsoredName})
        if(sponsoredNameCoupon.length === 0){
            console.log({message: `No coupons found of sponsored name ${sponsoredName}`});
            return res.json({message: `No coupons found of sponsored name ${sponsoredName}`})
        }
        await sponsoredNameCoupon.map(coupon => {
      coupon.isCancelled = true
      return coupon.save()
    })
  
        console.log({message: `All coupons of ${sponsoredName} has been cancelled`});
        return res.json({message: `All coupons of ${sponsoredName} has been cancelled`})
    }
}

// Coupons Status------------------------------------------------------------------------------------------------------------------------------------

async function couponStatus(req,res) {
        const {type} = req.query
        const today = new Date()
        let filter = {}

        if(type === "all"){
            filter = {}
        }else if(type === "active"){
            filter = {
                validTo: {$gte: today},
                isCancelled: false,
                isUsed: false
            }
        }else if(type === "expired"){
            filter = {
                validTo: {$lt: today},
                isCancelled: false,
                isUsed: false
            }
        }else if(type === "cancelled"){
            filter = {
                isCancelled: true,
            }
        }else if(type === "used"){
            filter = {
                isUsed: true
            }
        } else{
            return res.json({message: "Invalid Type"})
        }
        const coupons = await coupon.find(filter)
        return res.json({
            status: type,
            count: coupons.length,
            coupon: coupons
        })
}

// Show all coupons----------------------------------------------------------------------------------------------------------------------------------

async function allCoupons(req,res) {
    const allCoupon = await coupon.find({})
    res.json({message: "Here are all cards ", count: allCoupon.length, coupon: allCoupon})
}

// Search By Sponsored Name------------------------------------------------------------------------------------------------------------------------------------------------------

async function searchBySponsoredName(req,res) {
    const {searchBySponsoredName,status} = req.body
    if(!searchBySponsoredName) return res.status(400).json({message: "Enter Sponsored Name"})
    const today = new Date()
    let filter = {
        sponsoredName: searchBySponsoredName
    }
    if(status === "active"){
        filter.isCancelled = false
        filter.isUsed = false
        filter.validTo = {$gte: today}
    } else if(status === "expired"){
        filter.isCancelled = false
        filter.isUsed = false
        filter.validTo = {$lt: today}
    } else if (status === "cancelled"){
        filter.isCancelled = true
    } else if (status === "used"){
        filter.isUsed = false
    }

    const allCouponsBySponsoredName = await coupon.find(filter)

    if(allCouponsBySponsoredName.length === 0) return res.status(400).json({message: "No sponsored name found"})
    res.json({message: "Found Sponsored Name", couponsBySponsoredName: allCouponsBySponsoredName})
}

module.exports = {
    generateCoupon,
    validateCoupon,
    cancelCoupon,
    couponStatus,
    allCoupons,
    searchBySponsoredName
}