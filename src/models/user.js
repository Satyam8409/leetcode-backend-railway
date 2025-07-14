const mongoose=require('mongoose');
const {Schema}=mongoose;

const userSchema=new Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:20,
    },
    lastName:{
        type:String,
        minLength:3,
        maxLength:20,
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        immutable:true,
        lowercase:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        min:6,        
        max:80,
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user',
    },
    problemSolved:{//ye tb fill krge jb submission model ban jayega 
        type:[{
            type:Schema.Types.ObjectId,
            ref:'problem'
        }],
        unique:true
    },
    
},{timestamps:true});

const User= mongoose.model('user',userSchema);

module.exports=User;