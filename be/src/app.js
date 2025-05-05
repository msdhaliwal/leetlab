import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get('/ping', (req, res) => {
	res.send('pong');
});

export default app;
