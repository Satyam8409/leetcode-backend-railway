const User=require('../models/user');
const validate=require('../utils/validator')
const bcrypt=require('bcrypt');
const jwt= require('jsonwebtoken');
const redisClient = require('../config/redis');
const Submission=require('../models/submission');

/*Yes, schema validation runs automatically during User.create(), and 
your custom validate() runs manually before that. Both layers work together to ensure clean, correct data.

*/

const register=async(req,res)=>{
    try{
        validate(req.body);//all must field present (with correct format)

        req.body.password=await bcrypt.hash(req.body.password,10);
        req.body.role='user';//this ensure that anyone registering through this this route will be user only
        const dbUser= await User.create(req.body);
 
        const token=jwt.sign({_id:dbUser.id, emailId:dbUser.emailId},process.env.SECRET_KEY,{expiresIn:'2d'});//jwt token generation
        // res.cookie('token',token)
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: "None",
            secure: true
        });


        // res.status(201).send('user registered successfully');
        const reply = {
    firstName: dbUser.firstName,
    emailId: dbUser.emailId,
    _id: dbUser._id,
    role: dbUser.role,
};
        res.status(200).json({
            user:reply,
            msg:'loggin successfully',
        });
    }
    catch(err){
        console.error("REGISTER ERROR:", err);
        res.status(400).json({ error: err.message });
    }
}

const login=async (req,res)=>{
    try{
        const {emailId,password}=req.body;
        if(!emailId) throw new Error("invalid crediential e");
        if(!password) throw new Error("invalid crediential p");

        const dbUser=await User.findOne({emailId});
        if(!dbUser) throw new Error("invalid crediential e");
        
        const passValid=await bcrypt.compare(password,dbUser.password);
        if(!passValid) throw new Error("invalid crediential p");
        
        const token=jwt.sign({_id:dbUser.id, emailId:dbUser.emailId},process.env.SECRET_KEY,{expiresIn:'2d'});//jwt token generation
        // res.cookie('token',token)
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: "None",
            secure: true
        });


        // res.status(200).send('Logged in successfully');//ye msg jo frontend ko bhej rahe hai isse aacha user ka data send kr denge 
        const reply={
            fistName:dbUser.firstName,
            emailId:dbUser.emailId,
            _id:dbUser._id,
        }
        
        res.status(200).json({
            user:reply,
            msg:'loggin successfully',
        });
    }
    catch(err){
        res.status(401).send("error: "+err)
    }
}

/*what to do for logout
    -for logout he must be login already //mtlb uske pas valid token hona chaiye, to ye check krna prega //create middleware for this purpose 
    -agar token valid hua to usko redis db me store kr na prega to make it as blocked 
   
*/

const logout=async(req,res)=>{
    try{
        const {token}= req.cookies;
        await redisClient.set(`token:${token}`, `Blocked`);
        const payload=jwt.decode(token);
        await redisClient.expireAt(`token:${token}`,payload.exp);

        // res.cookie('token', null, {expires:new Date(Date.now())});
        res.cookie('token', '', {
            expires: new Date(0),
            httpOnly: true,
            sameSite: "None",
            secure: true
        });

        res.send('logout successfully')
    }
    catch(err){
        res.status(503).json({error:err.message});
    }

}

const adminRegister=async (req,res)=>{
    try{
        if(!req.body) throw new Error("body data is missing");
        
        validate(req.body);

        req.body.password=await bcrypt.hash(req.body.password,10);
        req.body.role='admin';
        const dbUser= await User.create(req.body);
        
        const token=jwt.sign({_id:dbUser.id, emailId:dbUser.emailId},process.env.SECRET_KEY,{expiresIn:'2d'});//jwt token generation
        res.cookie('token',token)
        res.status(201).send('admin registered successfully');
    }
    catch(err){
        res.status(400).json({ error: err.message });
    }
    
}

const deleteProfile=async (req,res)=>{
    try{
        const UserId=req._id;
        //user deleted successfully from User schema
        await User.findByIdAndDelete(UserId);
        //oo user jitna v code submit kiya hai usko v del krna prega Submission schema se
        await Submission.deleteMany({UserId})
        res.status(200).send('user and its related all data deleted successfully')

    }
    catch(err){
        res.status(400).json({ error: err.message });
    }
}




module.exports={register, login, logout, adminRegister, deleteProfile};