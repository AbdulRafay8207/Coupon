const coupon = require("../models/CouponsModel")

// Generating coupons----------------------------------------------------------------------------------------

async function generateCoupon(req,res) {
    const {discountValue, area, validFrom, validTo, discountType, services, quantity} = req.body
    if(!discountValue || !area || !validFrom || !validTo || !discountType || !services || !quantity){
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
        coupons.push({
        secret: generateSecretCode(),
        discountValue: discountValue,
        discountType: discountType,
        services: services,
        area: area,
        validFrom: validFrom,
        validTo: validTo,
        isUsed: false,
        isCancelled: false,
        usedAt: ""
        })
    }
    const result = await coupon.insertMany(coupons)

    console.log({message: "successfully created", resut: result});
    return res.status(200).json({message: "successfully created", coupon: result})
}

// Validating coupons-------------------------------------------------------------------------------------------

async function validateCoupon(req,res) {
    const {id,token,secret} = req.body
    const allCoupons = await coupon.find({})
    const filteredCoupon = allCoupons.find(c => c._id.toString() === id || (c.token === token && c.secret === secret))


    if(!filteredCoupon){
        console.log({message: "invalid card"});
        return res.json({message: "invalid card"})
    }
    if(filteredCoupon.isCancelled){
        console.log({message: "Your card is cancelled"});
        return res.json({message: "Your card is cancelled"})
        
    }
    if(filteredCoupon.isUsed){
        console.log({message: "Card is already used"});
        return res.json({message: "Card is already used"})
    }
    const today = new Date()
    const fromData = new Date(filteredCoupon.validFrom)
    const toData = new Date(filteredCoupon.validTo)
    if(today > toData){
        console.log({message: "Card is expired"});
        return res.json({message: "Card is expired"})
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
    const { token, area } = req.body

    if(token){
        const coupon = allCoupon.find(c => token === c.token)
        if(!coupon){
            return res.json({message: "coupon not found"})
        }
        coupon.isCancelled = true
        await coupon.save()

        console.log({message: `coupon ${token} is successfully cancelled`});
        return res.json({message: `coupon ${token} is successfully cancelled`})
    }

    if(area){
        const areaCoupon = await coupon.find({area})
        if(areaCoupon.length === 0){
            console.log({message: `No coupons found for area ${area}`});
            return res.json({message: `No coupons found for area ${area}`})
        }
        await areaCoupon.map(coupon => {
      coupon.isCancelled = true
      return coupon.save()
    })
  
        console.log({message: `All coupons of ${area} has been cancelled`});
        return res.json({message: `All coupons of ${area} has been cancelled`})
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

// Search By Area------------------------------------------------------------------------------------------------------------------------------------------------------

async function searchByArea(req,res) {
    const {searchByArea,status} = req.body
    if(!searchByArea) return res.status(400).json({message: "Enter Area"})
    const today = new Date()
    let filter = {
        area: searchByArea
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

    const allCouponsByArea = await coupon.find(filter)

    if(allCouponsByArea.length === 0) return res.status(400).json({message: "No area found"})
    res.json({message: "Found area", couponsByArea: allCouponsByArea})
}

module.exports = {
    generateCoupon,
    validateCoupon,
    cancelCoupon,
    couponStatus,
    allCoupons,
    searchByArea
}