const express= require('express');
const adminMiddleware = require('../middleware/adminMiddleware');
const {createProblem, updateProblem, deleteProblem, getProblemById, getAllproblem, solvedAllProblemByUser, allSubmitSolution} = require('../controllers/userProblem');
const userMiddleware = require('../middleware/userMiddleware');


const problemRouter=express.Router();

//admin access required for this api to hit
problemRouter.post('/create', adminMiddleware, createProblem);
problemRouter.put('/update/:_id', adminMiddleware, updateProblem);
problemRouter.delete('/delete/:_id', adminMiddleware, deleteProblem);

//for all
problemRouter.get('/problemById/:_id', userMiddleware, getProblemById);
problemRouter.get('/getAllProblem/', userMiddleware, getAllproblem);
// problemRouter.get('/getPaginationProblem/', userMiddleware, getPagination);
problemRouter.get('/problemSolvedByUser', userMiddleware, solvedAllProblemByUser);//isko implement krne se phele problem submission model bana prega tb to db me o save hoaga phir ye data la payege L8
problemRouter.get('/allSubmitSolution/:id', userMiddleware, allSubmitSolution)                     //ek prbm ke liye kitna solution submit kiye hai sb lake dega ye route

module.exports=problemRouter;










//createPrbm
//getPrbm
//updatePrbm
//delPrbm
