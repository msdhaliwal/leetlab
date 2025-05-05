import express from 'express';
import { GetUser, LoginUser, LogoutUser, RegisterUser } from '../controller/auth.controller.js';
import { ValidateLogin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', RegisterUser);

router.post('/login', LoginUser);

router.post('/logout', ValidateLogin, LogoutUser);

router.get('/check', ValidateLogin, GetUser);

export default router;
