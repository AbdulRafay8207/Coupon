require("dotenv").config()

const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")

const couponsRoute = require("./routes/couponRouter")
const userRoute = require("./routes/userRouter")

const path = require("path")
const {connectMongoDB} = require('./connection')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const {restrictLoggedInUserOnly} = require("./middleware/authMiddleware")
const { connectToDataBase } = require("./db")

const app = express()

app.use(cors({
  origin: [
    "https://coupon-five-henna.vercel.app",
    "http://localhost:5176",
  ],
  credentials: true
}));
app.use(express.json())
app.use(cookieParser())

// connectMongoDB("mongodb://127.0.0.1:27017/coupon").then(()=> console.log("MongoDB connected"))
connectToDataBase()

app.use('/coupons',restrictLoggedInUserOnly, couponsRoute)
app.use('/',userRoute)

// Slash Page------------------------------------------------------------------------------------------------------------------------------

app.get('/',(req,res)=>{
    res.json({message:"hello from backend"})
})


const PORT = process.env.PORT || 8000

app.listen(PORT,()=>console.log(`Server running on port ${PORT}`))