const jwt=require('jsonwebtoken');
const User=require('../models/user');
const redisClient = require('../config/redis');

const userMiddleware=async (req,res,next)=>{
    try{
        const {token}=req.cookies;
        if(!token) throw new Error("token does not exist you are already logout");
        
        let payload=jwt.verify(token, process.env.SECRET_KEY);
        if(!payload) throw new Error("invalid token");
        
        const {_id}=payload;
        if(!_id) throw new Error("you have not attach id in payload during jwt.sign");
            
        const dbUser=await User.findById(_id);
        if(!dbUser) throw new Error("user with such id does not exist in db");
        
        //check if token is blocked
        const isBlocked=await redisClient.exists(`token:${token}`);
        if(isBlocked) throw new Error("this token is blocked");
        
        req.user=dbUser;
        req._id=_id;

        next();

    }
    catch (err) {
        res.status(401).json({ error: err.message });// Send proper error response
    }
}

module.exports=userMiddleware;