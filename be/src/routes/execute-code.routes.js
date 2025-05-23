import express from 'express';
import { executeCode } from '../controllers/execute-code.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const executionRoutes = express.Router();

executionRoutes.post('/', authMiddleware, executeCode);

export default executionRoutes;
