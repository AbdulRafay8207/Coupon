function roleMiddleware(...roles){
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.json({message: "Access Denied"})
        }
        next()
    }
}
module.exports = roleMiddleware