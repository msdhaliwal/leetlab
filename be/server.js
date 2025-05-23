import 'dotenv/config';
import http from 'http';

import app from './src/app.js';
const PORT = parseInt(process.env.PORT, 10);

const server = http.createServer(app);


const SELF_URL = process.env.SELF_URL || 'http://localhost';
server.listen(PORT, () => {
	console.log(`Server running at ${SELF_URL}:${PORT}`);
});

server.on('error', (err) => {
	console.error('Error starting server:', err);
	process.exit(1);
});

process.on('unhandledRejection', (reason) => {
	console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
	console.error('Uncaught Exception:', err);
	process.exit(1);
});
