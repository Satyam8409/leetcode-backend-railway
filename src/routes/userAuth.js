const express=require('express');
const {register, login, logout, adminRegister, deleteProfile}= require('../controllers/userAuthent');
const userMiddleware = require('../middleware/userMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const authRouter= express.Router();

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/logout', userMiddleware, logout)

//separate path for adimn register
authRouter.post('/admin/register', adminMiddleware, adminRegister);
authRouter.delete('/deleteProfile', userMiddleware, deleteProfile);

//this route created when started working with frontend bcz on frontend with each request there is api which run by-default ,so to handle that request this api created 
authRouter.get('/check', userMiddleware, (req,res)=>{
    const reply={
        firstName:req.user.firstName,
        emailId:req.user.emailId,
        _id:req.user._id,
        role:req.user.role,
    }
    res.status(201).json({
        user:reply,
        msg:'valid user',
    })
})

module.exports=authRouter;