const {getlanguageById, submitBatch, submitToken} = require("../utils/problemUtility");
const Problem = require("../models/problem");
const User = require("../models/user");
const Submission = require("../models/submission");


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
            
            const submitResult=await submitBatch(submission);

            console.log(submitResult);
            
            /*resultToken me token ko array form me rkhna hai ,kyki token ko jb judge0 ko submit krna hai to o array form me hona chaiye   */
            const resultToken=submitResult.map(val=>val.token)
            console.log(resultToken);
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

const solvedAllProblemByUser=async (req,res)=>{
  try{
    const userId=req.user._id;
    //const user=await User.findById(userId).populate('problemSolved');        //.populate() se oo sara prbm ka data leke aa jayega jiska id usme hai 
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

if (allSolOfSpecificPrbm.length === 0) {
      //Always return JSON
      return res.status(200).json([]);
    }

    //Fix the typo: use .json()
    res.status(200).json(allSolOfSpecificPrbm);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports={createProblem, updateProblem, deleteProblem, getProblemById, getAllproblem, solvedAllProblemByUser, allSubmitSolution};