const mongoose = require("mongoose")

const couponSchema = mongoose.Schema({
    token: {
        type: String,
    },
    secret: {
        type: String,
        required: true,
        unique: true
    },
    discountValue: {
        type: String,
        required: true
    },
    discountType: {
        type: String,
        enum: ["flat", "service"],
        default: "flat"
    },
    services : {
        type: [String],
        default: []
    },
    sponsoredName: {
        type: String,       
        required: true
    },
    validFrom: {
        type: Date,
        required: true
    },
    validTo: {
        type: Date,
        required: true
    },
    isUsed: {
        type: Boolean,
        required: true
    },
    isCancelled: {
        type: Boolean,
        required: true
    },
    usedAt: {
        type: String,
    },
})

const coupon = mongoose.model("coupon", couponSchema)

module.exports = coupon