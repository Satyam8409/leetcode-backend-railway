const mongoose=require('mongoose');
const {Schema}=mongoose;

const prbmSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    difficulty:{
        type:String,
        enum:['basic','easy','medium','hard'],
        required:true,
    },
    tags:{
        type:String,
        enum:['array','linkedList','graph','dp'],
        required:true
    },
    visibleTestCases:[
        {
            input:{
                type:String,
                required:true,
            },
            output:{
                type:String,
                required:true,
            },
            explanation:{
                type:String,
                required:true
            }
        }
    ],

    hiddenTestCases:[
        {
            input:{
                type:String,
                required:true,
            },
            output:{
                type:String,
                required:true,
            }
        }
    ],

    startCode: [
        {
            language:{
                type:String,
                required:true,
            },
            initialCode:{
                type:String,
                required:true
            }
        }
    ],

    referenceSolution:[//to check if solution submitted by user is correct or not for there input
        {
            language:{
                type:String,
                required:true,
            },
            completeCode:{
                type:String,
                required:true
            }
        }
    ],

    problemCreator:{//This means the problemCreator field must store an ObjectId, and that ObjectId refers to a document in the "user" collection.
        type:Schema.Types.ObjectId,
        ref:"user",
        required:true,
    }

},{timestamps:true})

const Problem=mongoose.model('problem',prbmSchema);
module.exports=Problem;

