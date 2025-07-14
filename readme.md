LEETCODE_PROJECT

1.How we will run our code
-Judge0:an open-source online code execution engine ,our code will be run by Judge0 ,we wont run our code directly on          server bcz code might be dangerous and can damage the server.

2.firstly we are working on Backend
2.1.API
2.2.Schema
    1.user
    2.problem
    3.submission


3.starting the backend of the project folder structur
    1.src
        └────────config────────────────db.js 
                       ────────────────redis.js 

        └────────controllers───────────userAuthent.js 
                            ───────────userProblem.js 
                            ───────────userSubmission.js
                            

        └────────middleware────────────userMiddleware.js
                           ────────────adminMiddleware.js 

        └────────models────────────────user.js
                       ────────────────problem.js 
                       ────────────────submission.js

        └────────routes────────────────userAuth.js
                       ────────────────problemCreator.js
                       ────────────────submit.js 

        └────────utils ────────────────validator.js 
                       ────────────────problemUtility.js 

        ────────index.js



3.starting the backend of the project all dependencies
    1.npm init -y
    2.npm i express
    3.npm i dotenv
    4.npm i mongoose
    5.npm i cookie-parser
    6.npm i validator
    7.npm i bcrypt
    8.npm i jsonwebtoken
    9.npm i redis
    10.npm i axios
