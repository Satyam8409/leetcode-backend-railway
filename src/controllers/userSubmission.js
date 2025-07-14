const Problem = require("../models/problem");
const { getlanguageById, submitBatch, submitToken } = require("../utils/problemUtility");
const Submission=require('../models/submission');

//isme wrong solution ko v store krna hota hai user ka
const submitCode=async (req,res)=>{
    try{
        const prbmId=req.params.id;
        const userId=req._id;
        const {code,language}=req.body;

        if(!prbmId||!userId||!code||!language){
            return res.status(400).send("maandatory field is missing to submit code")
        }

        //aab db se jo problem ko solve kr rahe hai usko lana hoga to get hiddenTestCase jisse decide krge ki given sol code by user is correct or not by passing lang,code,i/p,expected o/p to judge0 
        const prbmToSolve=await Problem.findById(prbmId);

        //jaise hi code user bhej diya usko db me store kra dete hai before judge0 ,tkki kavi judge0 me koi issue ho to code bd me store rhna chaiye ,pr iska status pending rahega , fir jb judge0 run krke result bhej dega to iska status ko update kr denge judge0 ke result me jo status hoga usse
        const submittedResult= await Submission.create({
            userId:userId,
            problemId:prbmId,
            code:code,
            language:language,
            status:'pending',
            testCasesTotal:prbmToSolve.hiddenTestCases.length
        })

        const langId=getlanguageById(language); 

        const submission=prbmToSolve.hiddenTestCases.map((testcase)=>({  //creating batchh submition
                source_code:code,
                language_id:langId,
                stdin:testcase.input,
                expected_output:testcase.output,
        }))

        const submitResult=await submitBatch(submission);
        const resultToken=submitResult.map(val=>val.token);
        const testResult=await submitToken(resultToken);
        console.log(testResult);


        //aab jo submittedResult ko db me judge0 se phele submit kr diye the usko update krna hoga juge0 ke result se
        let status='accepted';
        let testCasesPassed=0;
        let runtime=0;
        let memory=0;
        let errorMessage=null;

        for(let test of testResult){
            if(test.status_id==3){
                testCasesPassed++;
                runtime=runtime+parseFloat(test.time);
                memory=Math.max(memory,test.memory);
            }
            else{
                if(test.status_id==4){
                    status='error';
                    errorMessage=test.stderr;
                }
                else{
                    status='wrong';
                    errorMessage=test.stderr;
                }
            }
        }

        //aab jake db me judge0 wala result ko save krege
        submittedResult.status=status;
        submittedResult.testCasesPassed=testCasesPassed;
        submittedResult.runtime=runtime;
        submittedResult.memory=memory;
        submittedResult.errorMessage=errorMessage;

        await submittedResult.save();

        //aab ye prbm ko user solved kr diya to isse prbmId ko userSchema ke problemSolved me stored kra denge //pr ye v check krna jaruri hai ki kahi user phele se to ise prbm ko solved nhi kr diya hai
        if(!req.user.problemSolved.includes(prbmId)){//jb mw run hua to req.user=dbUser kiye the udher se isko la rahe hai
            req.user.problemSolved.push(prbmId);
            req.user.save();
        }

        // res.status(201).send(submittedResult);
        const accepted=(status=='accepted')
        res.status(201).json({
            accepted,
            totalTestCases:submittedResult.testCasesTotal,
            passedTestCases:testCasesPassed,
            runtime,
            memory
        });

    }
    catch(err){
      res.status(400).send("error:" +err)
    }
    


}





const runCode=async (req,res)=>{
    try{
        const prbmId=req.params.id;
        const userId=req._id;
        const {code,language}=req.body;

        if(!prbmId||!userId||!code||!language){
            return res.status(400).send("maandatory field is missing to submit code")
        }

        //aab db se jo problem ko solve kr rahe hai usko lana hoga to get hiddenTestCase jisse decide krge ki given sol code by user is correct or not by passing lang,code,i/p,expected o/p to judge0 
        const prbmToSolve=await Problem.findById(prbmId);

        const langId=getlanguageById(language); 

        const submission=prbmToSolve.visibleTestCases.map((testcase)=>({  //creating batchh submition
                source_code:code,
                language_id:langId,
                stdin:testcase.input,
                expected_output:testcase.output,
        }))

        const submitResult=await submitBatch(submission);
        const resultToken=submitResult.map(val=>val.token);
        const testResult=await submitToken(resultToken);
        // console.log(testResult);
        // res.status(201).send(testResult);
        // const accepted=(status=='accepted')

        //after frontend made thi change
        let status=true;
        let testCasesPassed=0;
        let runtime=0;
        let memory=0;
        let errorMessage=null;

        for(let test of testResult){
            if(test.status_id==3){
                testCasesPassed++;
                runtime=runtime+parseFloat(test.time);
                memory=Math.max(memory,test.memory);
            }
            else{
                if(test.status_id==4){
                    status=false;
                    errorMessage=test.stderr;
                }
                else{
                    status=false;
                    errorMessage=test.stderr;
                }
            }
        }
        res.status(201).json({
            success:status,
            testCases:testResult,
            runtime,
            memory
        });



    }
    catch(err){
      res.status(400).send("error:" +err)
    }
    


}


module.exports={submitCode,runCode};