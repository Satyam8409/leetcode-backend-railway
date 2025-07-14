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




// authRouter.post('/getProfile', getProfile)


module.exports=authRouter;