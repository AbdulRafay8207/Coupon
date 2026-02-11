const mogngoose = require("mongoose")

 const connectToDataBase = async ()=>{
    try {
        await mogngoose.connect(process.env.URL)
        console.log("mongodb connected");
    } catch (error) {
        console.log("Error in mongodb",error)
        process.exit(1)
    }
}

module.exports = {
    connectToDataBase
}