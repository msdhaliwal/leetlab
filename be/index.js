/* entry file */
import app from './src/app.js';
import 'dotenv/config';
const port = process.env.PORT || 4009;

try {
	app.listen(port, () => {
		console.log(`server running successfully on ${process.env.HOST}:${port}`);
	});
} catch (error) {
	console.log('server failed to start');
}
