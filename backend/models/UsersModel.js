const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    branchName: {
        type: String,
        required: true
    },
    contactNumber: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "lab"],
        default: "lab"
    },
    status: {
        type: String,
        default: "Active"
    }
},{timestamps: true})

const User = mongoose.model("user",userSchema)

module.exports = User