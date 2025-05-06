import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

import AuthRouter from './router/auth.router.js';
import ProblemRouter from './router/problem.router.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get('/ping', (req, res) => {
	res.send('pong');
});

app.use('/auth', AuthRouter);

app.use('/problem', ProblemRouter);

export default app;
