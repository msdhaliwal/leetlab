import express from 'express';
import { CreateProblem, ListAllProblems, GetProblemById, UpdateProblem, DeleteProblem, GetSolvedProblemsForUser } from '../controller/problem.controller.js';
import { ValidateLogin, CheckAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', ValidateLogin, CheckAdmin, CreateProblem);

router.get('/', ValidateLogin, ListAllProblems);

router.get('/solved', ValidateLogin, GetSolvedProblemsForUser);

router.get('/:id', ValidateLogin, GetProblemById);

router.put('/:id', ValidateLogin, CheckAdmin, UpdateProblem);

router.delete('/:id', ValidateLogin, CheckAdmin, DeleteProblem);

export default router;
