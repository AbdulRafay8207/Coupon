const http = require("http")
const express = require("express")
const cors = require("cors")
const {v4: uuidv4, validate} = require("uuid")
const path = require("path")
const fs = require("fs")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const users = require("./data/users")
const authMiddleware = require("./Middleware/authMiddleware")
const roleMiddleware = require("./middleware/roleMiddleware")
const dataFilePath = path.join(__dirname,"./db.json")

const MYSECRETKEY = "SuperSecret"


const app = express()

app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
    res.send("hello from backend")
})

// Login-------------------------------------------------------------------------------------------

app.post('/login',(req,res)=>{
    const {username, password} = req.body

    const user = users.find(u => u.username === username)
    if(!user){
        return res.json({message: "invalid username"})
    }

    const isMatch = bcrypt.compare(password,user.password)
    if(!isMatch){
        return res.json({message:"invalid password"})
    }

    const token = jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        MYSECRETKEY,
        {expiresIn: "1h"}
    )

    res.json({message: "login successfully",token, role: user.role})
})

// Generating Card----------------------------------------------------------------------------------------

app.post('/cards/create',authMiddleware,roleMiddleware("admin"), async (req,res)=>{
    const {discountValue, area, validFrom, validTo} = req.body
    if(!discountValue || !area || !validFrom || !validTo){
        return res.send({message: "all fields are required!"})
    }
    function generateSecretCode(length = 14){
        let result = ""
        const randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        for(i=0; i<length; i++){
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length))
        }
        return result.toUpperCase()
    }
    const fileData = fs.readFileSync(dataFilePath,"utf-8")
    const cards = JSON.parse(fileData)
    const qrid = uuidv4()
    const tokenNo = cards.length + 1
    const token = "TKN-" + tokenNo
    const secretCode = generateSecretCode()
    const newCard = {
        qrid,
        token,
        secret: secretCode,
        discountValue,
        area,
        validFrom,
        validTo,
        isUsed: false,
        isCancelled: false,
        usedAt:"",
    }
    cards.push(newCard)
    fs.writeFileSync(dataFilePath,JSON.stringify(cards,null,2))
    console.log({message: "successfully creared", card: cards});
    return res.status(200).json({message: "successfully created", card: cards})
})

// Validating Card-------------------------------------------------------------------------------------------

app.post('/cards/validate',authMiddleware,roleMiddleware("admin","cashier"),(req,res)=>{
    const {qrid,token,secret} = req.body
    const fileData = fs.readFileSync(dataFilePath,"utf-8")
    const cards = JSON.parse(fileData)
    const card = cards.find(c => c.qrid === qrid || (c.token === token && c.secret === secret))

    if(!card){
        console.log({message: "invalid card"});
        return res.json({message: "invalid card"})
    }
    if(card.isCancelled){
        console.log({message: "Your card is cancelled"});
        return res.json({message: "Your card is cancelled"})
        
    }
    if(card.isUsed){
        console.log({message: "Card is already used"});
        return res.json({message: "Card is already used"})
    }
    const today = new Date()
    const fromData = new Date(card.validFrom)
    const toData = new Date(card.validTo)
    if(today > toData){
        console.log({message: "Card is expired"});
        return res.json({message: "Card is expired"})
    }
    card.isUsed = true
    card.usedAt = new Date()
    fs.writeFileSync(dataFilePath,JSON.stringify(cards,null,2))
    console.log({
        message: "Coupon successfully applied",
        discountValue: card.discountValue
    });
    
    return res.json({
        message: "Coupon successfully applied",
        discountValue: card.discountValue
    })
})

// Cancelling Card ------------------------------------------------------------------------------

app.post('/cards/cancel',authMiddleware,roleMiddleware("admin"),(req,res)=>{
    const filedata = fs.readFileSync(dataFilePath,'utf-8')
    const cards = JSON.parse(filedata)
    const { token, area } = req.body

    if(token){
        const card = cards.find(c => token === c.token)
        if(!card){
            return res.json({message: "card not found"})
        }
        card.isCancelled = true
        fs.writeFileSync(dataFilePath, JSON.stringify(cards, null, 2))
        console.log({message: `Card ${token} is successfully cancelled`});
        return res.json({message: `Card ${token} is successfully cancelled`})
    }

    if(area){
        const areaCards = cards.filter(c => c.area === area)
        if(areaCards.length === 0){
            console.log({message: `No cards found for area ${area}`});
            return res.json({message: `No cards found for area ${area}`})
        }
        areaCards.forEach(c => c.isCancelled = true)
        fs.writeFileSync(dataFilePath, JSON.stringify(cards, null, 2))
        console.log({message: `All coupon of ${area} has been cancelled`});
        return res.json({message: `All coupon of ${area} has been cancelled`})
    }
}
)

// Card Status------------------------------------------------------------------------------------------------------------------------------------------------------------

    app.get('/cards/status',authMiddleware,roleMiddleware("admin"),(req,res)=>{
        const {type} = req.query

        const fileData = fs.readFileSync(dataFilePath,'utf-8')
        const cards = JSON.parse(fileData)
        const today = new Date()

        const filterCards = cards.filter(card => {
            const validTo = new Date(card.validTo)

            if(type === "active"){
                console.log("active");
                
                return (
                    today <= validTo && !card.isCancelled && !card.isUsed
                )
            }
            if(type === "expired"){
                return today > validTo || card.isCancelled || card.isUsed
            }
            return res.json({message: "false type"})
        })        

        return res.json({
            status: type,
            count: filterCards.length,
            cards: filterCards
        })
    })

// Show all cards----------------------------------------------------------------------------------------------------------------------------------

app.get('/cards',authMiddleware,roleMiddleware("admin"), (req,res)=>{
    const filedate = fs.readFileSync(dataFilePath,"utf-8")
    const cards = JSON.parse(filedate)
    res.json({message: "Here are all cards ", count: cards.length, Cards: cards})
})


app.listen(5000,()=>console.log("server running on port 5000"))