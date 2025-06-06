import express from 'express';
import { register, login, logout, check, getGoogleAuthSettings, getGoogleAuthCallback } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const authRoutes = express.Router();

authRoutes.get('/google', getGoogleAuthSettings);

authRoutes.post('/google/callback', getGoogleAuthCallback);

authRoutes.post('/register', register);

authRoutes.post('/login', login);

authRoutes.post('/logout', authMiddleware, logout);

authRoutes.get('/check', check);

export default authRoutes;
