const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
// const {v4: uuidv4} = require("uuid")

const couponsRoute = require("./routes/couponRouter")
const userRoute = require("./routes/userRouter")

const path = require("path")
const {connectMongoDB} = require('./connection')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const {restrictLoggedInUserOnly} = require("./middleware/authMiddleware")
const dataFilePath = path.join(__dirname,"./db.json")

const app = express()
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json())
app.use(cookieParser())

connectMongoDB("mongodb://127.0.0.1:27017/coupon").then(()=> console.log("MongoDB connected"))

app.use('/coupons',restrictLoggedInUserOnly, couponsRoute)
app.use('/',userRoute)

// Slash Page------------------------------------------------------------------------------------------------------------------------------

app.get('/',(req,res)=>{
    res.json({message:"hello from backend"})
})




app.listen(8000,()=>console.log("server running on port 8000"))