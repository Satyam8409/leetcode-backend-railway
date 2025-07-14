/*jodge0 me submission format
    -source_code:direct completeCode se utha lenge
    -language_id:fn banana prega jo lang ke corres id generate krega
    -stdin:visibleTestCases i/p se lelenge direct
    -expected_output:visibleTestCases o/p

*/

/*batch format for judge0
{
  "submissions": [
    {
      "language_id": 46,
      "source_code": "echo hello from Bash"
      "input":
      "output":
    },
    {
      "language_id": 123456789,
      "source_code": "print(\"hello from Python\")"
    },
    {
      "language_id": 72,
      "source_code": ""
    }
  ]
}


*/

/*how {...obj} works 
      It creates a new object named data with:
      All key–value pairs from req.body
      Adds or overrides a field problemCreator with the value from req._id

      Suppose:
        
      req.body = {
        title: "Sum of Two Numbers",
        difficulty: "Easy"
      };
        
      req._id = "abc123";
      Then:
        
      const data = {
        ...req.body,               // title + difficulty
        problemCreator: req._id    // new field added
      };
      Now data becomes:
        
      {
        title: "Sum of Two Numbers",
        difficulty: "Easy",
        problemCreator: "abc123"
      }
    
    */


const {getlanguageById, submitBatch, submitToken} = require("../utils/problemUtility");
const Problem = require("../models/problem");
const User = require("../models/user");
const Submission = require("../models/submission");



/*Actual flow of below code very important
Below is exactly how your code will run step by step in the loop:

✅ Iteration 1 — C++
Language: C++
Language ID: 54

Batch Submission Sent:[
  {
    "source_code": "<C++ code>",
    "language_id": 54,
    "stdin": "3 4",
    "expected_output": "7"
  },
  {
    "source_code": "<C++ code>",
    "language_id": 54,
    "stdin": "10 -2",
    "expected_output": "8"
  }
]
submitBatch() returns tokens:
[
  {"token": "token_cpp_1"},
  {"token": "token_cpp_2"}
]
submitToken() retrieves results:
{
  "submissions": [
    {
      "language_id": 54,
      "stdout": "7",
      "status_id": 3,
      "token": "token_cpp_1"
    },
    {
      "language_id": 54,
      "stdout": "8",
      "status_id": 3,
      "token": "token_cpp_2"
    }
  ]
}
All passed.

✅ Iteration 2 — Java
Language: Java
Language ID: 62

Batch Submission Sent:
[
  {
    "source_code": "<Java code>",
    "language_id": 62,
    "stdin": "3 4",
    "expected_output": "7"
  },
  {
    "source_code": "<Java code>",
    "language_id": 62,
    "stdin": "10 -2",
    "expected_output": "8"
  }
]
submitBatch() returns tokens:
[
  {"token": "token_java_1"},
  {"token": "token_java_2"}
]
submitToken() retrieves results:
{
  "submissions": [
    {
      "language_id": 62,
      "stdout": "7",
      "status_id": 3,
      "token": "token_java_1"
    },
    {
      "language_id": 62,
      "stdout": "8",
      "status_id": 3,
      "token": "token_java_2"
    }
  ]
}
All passed.

✅ Iteration 3 — JavaScript
Language: JavaScript
Language ID: 93

Batch Submission Sent:
[
  {
    "source_code": "<JavaScript code>",
    "language_id": 93,
    "stdin": "3 4",
    "expected_output": "7"
  },
  {
    "source_code": "<JavaScript code>",
    "language_id": 93,
    "stdin": "10 -2",
    "expected_output": "8"
  }
]
submitBatch() returns tokens:
[
  {"token": "token_js_1"},
  {"token": "token_js_2"}
]
submitToken() retrieves results:
{
  "submissions": [
    {
      "language_id": 93,
      "stdout": "7",
      "status_id": 3,
      "token": "token_js_1"
    },
    {
      "language_id": 93,
      "stdout": "8",
      "status_id": 3,
      "token": "token_js_2"
    }
  ]
}
✅ All passed.

*/

const createProblem=async (req,res)=>{
    const {title,description,difficulty,tags,visibleTestCases,hiddenTestCases,startCode,referenceSolution,problemCreater}=req.body;//ye sent data by admin ko direct db me store nhi kra skte hai,phele check krna prega ki valid hai ki nhi reference sol etc     //referenceSolution(rs) ko check krne ke liye visibleTestCases ka i/p denge or o/p se match hoga to right nhi to wrong //ye krne ke liye judge0 ka use krege

    try{
        //checking rs for all language(with all testcases) in judge0, isliye judge0 ke format me send krna necessary hai
        for(const {language,completeCode} of referenceSolution){      //rs array hai isliye uske andar ka data ko aise nikal rahe hai//judge0 ko language,completeCode, i/p, o/p ye sb cheez chaiye to decide if rs is right or not
            const langId=getlanguageById(language); 
            console.log(langId);
            
            const submission=visibleTestCases.map((testcase)=>({  //creating batchh submition
                source_code:completeCode,
                language_id:langId,
                stdin:testcase.input,
                expected_output:testcase.output,
            }))

            console.log(submission);
            

            /*submissionResult me token aayega isse form me hai
            [
              {
                "token": "db54881d-bcf5-4c7b-a2e3-d33fe7e25de7"
              },
              {
                "token": "ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1"
              },
              {
                "token": "1b35ec3b-5776-48ef-b646-d5522bdeb2cc"
              }
            ]           
            
            */
            const submitResult=await submitBatch(submission);

            console.log(submitResult);
            
            /*resultToken me token ko array form me rkhna hai ,kyki token ko jb judge0 ko submit krna hai to o array form me hona chaiye   */
            const resultToken=submitResult.map(val=>val.token)
            console.log(resultToken);

            /*result ke pass data isse format me aaya hai
            submissions: [
              {
                "language_id": 46,
                "stdout": "hello from Bash\n",
                "status_id": 3,
                "stderr": null,
                "token": "db54881d-bcf5-4c7b-a2e3-d33fe7e25de7"
              },
              {
                "language_id": 71,
                "stdout": "hello from Python\n",
                "status_id": 3,
                "stderr": null,
                "token": "ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1"
              }
            ]
            */
            const testResult=await submitToken(resultToken);
            for(let test of testResult){
              if(test.status_id!=3){
                return res.status(400).send('error occured');
              }
            }
        }



        //we checked all cases //now we can submit data to db
        const dbUser=await Problem.create({//.create se phele prbm schema run hoga
          ...req.body, 
          problemCreator:req._id //ye adminMw jb create kiye the tb dale the req._id me _id ka value to ohi se nikal rahe hai ye value
        }) 
        res.status(200).send('problem saved to db successfully');

    }
    catch(err){
      res.status(400).send("error:" +err)
    }


}

const updateProblem=async (req,res)=>{
  const {_id}= req.params;
  const {title,description,difficulty,tags,visibleTestCases,hiddenTestCases,startCode,referenceSolution,problemCreater}=req.body;

  try{
    if(!_id){
      return res.status(400).send('id is missing');
    } 
    const dbPrbm= await Problem.findById(_id);
    if(!dbPrbm){
      return res.status(400).send('no such problem in db with this id');
    }

    for(const {language,completeCode} of referenceSolution){      
      const langId=getlanguageById(language); 
      
      const submission=visibleTestCases.map((testcase)=>({  //creating batchh submition
          source_code:completeCode,
          language_id:langId,
          stdin:testcase.input,
          expected_output:testcase.output,
      }))
      const submitResult=await submitBatch(submission);

      const resultToken=submitResult.map(val=>val.token)      //resultToken me token ko array form me rkhna hai ,kyki token ko jb judge0 ko submit krna hai to o array form me hona chaiye   
      const testResult=await submitToken(resultToken);

      for(let test of testResult){
        if(test.status_id!=3){
          return res.status(400).send('error occured');
        }
      }
    }

    //update wala kaam yaha se start hua
    const updatedPrbm= await Problem.findByIdAndUpdate(_id, {...req.body}, {runValidators:true, new:true});
    res.status(200).send(updatedPrbm);

  }
  catch(err){
    res.status(404).send("error:" +err)
  }
}

const deleteProblem=async (req,res)=>{
  const {_id}=req.params;
  try{
    if(!_id){
      return res.status(400).send('id is missing');
    } 
    
    const deletedPrbm =await Problem.findByIdAndDelete(_id);
    if(!deletedPrbm){
      res.status(400).send('no such prbm in db with this id');
    }

    res.status(200).send('problem deleted successfully');

  }
  catch(err){
    res.status(404).send("error:" +err)
  }
  
}


//pura data bhej de rahe hai userko sara data bhejna not mandatory like hiddenTestCase,rs,problemCreator etc
const getProblemById=async (req,res)=>{
  const {_id}=req.params;
  try{
    if(!_id){
      return res.status(400).send('id is missing');
    }

    // const dbPrbm= await Problem.findById(_id); 
    const dbPrbm= await Problem.findById(_id).select("title description difficulty tags visibleTestCases startCode referenceSolution"); //.select() give power ki db se usse data me se konsa field bhej skte hai

    if(!dbPrbm){
      res.status(400).send('no such prbm in db with this id');
    }
    res.status(200).send(dbPrbm);
  }
  catch(err){
    res.status(404).send("error:" +err)
  }

}

//isme sirf title, difficulty, tags hi hona chaiye
const getAllproblem=async (req,res)=>{
  try{
    // const allDbPrbm=await Problem.find({}).select("title difficulty tags -_id");//id ko db khud se bhej deta hai agar nhi chaiye to -id kr do
    const allDbPrbm=await Problem.find({}).select("title difficulty tags");//id ko db khud se bhej deta hai agar nhi chaiye to -id kr do
    // const allDbPrbm=await Problem.find().skip((page-1)*limit).limit(10);

    if(allDbPrbm.length==0){
      res.status(400).send('db is empty');
    }
    res.status(200).send(allDbPrbm);
  }
  catch(err){
    res.status(404).send("error:" +err)
  }

}


/*Pagination  
    -agar db me 1000 prbms hai to sbko ek sath thodi layege, isse user exp khrab hoga kyuki wait jayada krna prega user ko 
    -to isse bachne ke liye pagination ka use krege ,phele kuch set of prbm le aayege fir next set of prbm layege and so on
    -isko achieve krne ke liye -->api me parameter bhej denge: localhost:3000/prbm/getAllprbm?page=2&limit=10 isse type se
*/
// const getPagination=async (req,res)=>{
//   try{
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;

//     const allDbPrbm=await Problem.find().skip((page-1)*limit).limit(limit);

//     if(allDbPrbm.length==0){
//       res.status(400).send('db is empty');
//     }
//     res.status(200).send(allDbPrbm);
//   }
//   catch(err){
//     res.status(404).send("error:" +err)
//   }

// }


const solvedAllProblemByUser=async (req,res)=>{
  try{

    // const solvedPrbmCount=req.user.problemSolved.length;
    // res.status(200).send(solvedPrbmCount) //res.status(200).send(req.user.problemSolved)

    /*Sara prbm ka data lana ho tb kyuki uper wala sirf count de raha hai
        -isse sirf no.of prbm solved hi sirf aa raha ,agar oo sab prbm ko lana ho tb->id to hai usse sara prbm le aayege db se ,
        -right but ek baar socho kitna db cll lagega, isse to isse se bachata hai ref,
        -ref ka concept use krege sara prbm lane ke liye -->populate se
      ref power
        -iske pas jo v prbm ka id hai usko direct refer kr skte hai or sara data prbm ka access kr skte hai  
    */
   
    const userId=req.user._id;
    // const user=await User.findById(userId).populate('problemSolved');        //.populate() se oo sara prbm ka data leke aa jayega jiska id usme hai 
    const user=await User.findById(userId).populate({
      path:'problemSolved',
      select:'title difficulty tags'
    })
    res.status(200).send(user.problemSolved);

    
  }
  catch(err){
    res.status(404).send("error:" +err)
  }

}

const allSubmitSolution=async (req,res)=>{
  try{
    const userId=req._id;
    const prbmId=req.params.id;
    const allSolOfSpecificPrbm=await Submission.find({userId,problemId:prbmId});
    console.log(allSolOfSpecificPrbm);
    

    // if(allSolOfSpecificPrbm.length==0){
    //   res.status(200).send('no solution for this problem')
    // }
    // res.status(200).res(allSolOfSpecificPrbm);
if (allSolOfSpecificPrbm.length === 0) {
      // Always return JSON
      return res.status(200).json([]);
    }

    // Fix the typo: use .json()
    res.status(200).json(allSolOfSpecificPrbm);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  // catch(err){
  //   res.status(404).send("error:" +err)
  // }
}


module.exports={createProblem, updateProblem, deleteProblem, getProblemById, getAllproblem, solvedAllProblemByUser, allSubmitSolution};