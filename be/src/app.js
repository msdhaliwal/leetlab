import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import executionRoutes from './routes/execute-code.routes.js';
import authRoutes from './routes/auth.routes.js';
import problemRoutes from './routes/problem.routes.js';
import submissionRoutes from './routes/submission.routes.js';
import playlistRoutes from './routes/playlist.routes.js';

const app = express();

app.use(
	cors({
		origin: "http://localhost:5173", // Or "*" for all origins (not recommended for production)
		methods: ['GET', 'POST', 'OPTIONS'],
		credentials: true,
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/ping', (req, res) => {
	res.send('PONG !!!');
});

app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/problems', problemRoutes);

app.use('/api/v1/execute-code', executionRoutes);

app.use('./api/v1/submission', submissionRoutes);

app.use('/api/v1/playlist', playlistRoutes);

const SELF_URL = process.env.SELF_URL;

const PORT = parseInt(process.env.PORT, 10);

if (isNaN(PORT)) {
	console.error(`Invalid PORT: ${process.env.PORT}`);
	process.exit(1);
}

app.set('port', PORT);

export default app;