const express=require('express');
require('dotenv').config();
const main=require('./config/db');
const cookieParser=require('cookie-parser');
const authRouter= require('./routes/userAuth');
const redisClient=require('./config/redis');
const problemRouter = require('./routes/problemCreator');
const submitRouter = require('./routes/submit');
const cors=require('cors');

const app=express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

console.log("FRONTEND_URL:", process.env.FRONTEND_URL);


app.use('/user', authRouter);
app.use('/problem',problemRouter);
app.use('/code',submitRouter)



async function InitializeConnection(){
    try{
        await Promise.all([redisClient.connect(),main()]);
        console.log('both db connection successful');
    
        app.listen(process.env.PORT,'0.0.0.0', ()=>{
            console.log(`app listening on port ${process.env.PORT}`);
        })
    }
    catch(err){
        console.log(err);
    }
    
}
InitializeConnection();
