import { db } from '../middleware/prisma.js';
import { LoginType, UserRole } from '../generated/prisma/index.js';
import jwt from 'jsonwebtoken';
import { HashText, IsSameHash } from '../utils/index.js';
import querystring from 'querystring';
import axios from 'axios';

export const register = async (req, res) => {
	try {
		const { email, password, name } = req.body;
		const userExists = await db.user.findUnique({ where: { email } });
		if (userExists) {
			throw { status: 429, message: `User already exists` };
		}
		const newUser = await db.user.create({ data: { email, password, name, role: UserRole.USER } });
		const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
		res.cookie('jwt', token, {
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV !== 'development',
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		});
		const userObject = { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role, image: newUser.image };
		res.status(201).json({ success: true, message: 'User created successfully', user: userObject });
	} catch (error) {
		const statusCode = error?.status ?? 500;
		const message = error?.message ?? 'Error creating user';
		res.status(statusCode).json({ success: false, message });
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await db.user.findUnique({ where: { email: HashText(email) } });
		if (!user) {
			throw { status: 401, message: `Invalid credentials` };
		}
		if (user.login_type !== LoginType.EMAIL_PASSWORD) {
			/* if user exists and is not email & password */
			throw { status: 400, message: `Account is not email & password` };
		}
		const isPasswordValid = IsSameHash(password, user.password);
		if (!isPasswordValid) {
			throw { status: 401, message: `Invalid credentials` };
		}
		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
		res.cookie('jwt', token, {
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV !== 'development',
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		});
		const userObject = { id: user.id, email: user.email, name: user.name, role: user.role, image: user.image };
		res.status(200).json({ success: true, message: 'User logged in successfully', user: userObject });
	} catch (error) {
		const statusCode = error?.status ?? 500;
		const message = error?.message ?? 'Error logging in user';
		return res.status(statusCode).json({ success: false, message });
	}
};

export const logout = async (req, res) => {
	try {
		res.clearCookie('jwt', {
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV !== 'development',
		});
		res.status(200).json({ success: true, message: 'User logged out successfully' });
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Error logging out user' });
	}
};

export const check = async (req, res) => {
	try {
		const token = req.cookies.jwt;
		if (!token) {
			throw { status: 204 };
		}
		let decoded;
		try {
			decoded = jwt.verify(token, process.env.JWT_SECRET);
		} catch (error) {
			throw { status: 401, message: `Unauthorized` };
		}
		const user = await db.user.findUnique({
			where: { id: decoded.id },
			select: { id: true, image: true, name: true, email: true, role: true },
		});
		if (!user) {
			throw { status: 401, message: `Unauthorized` };
		}
		req.user = user;
		res.status(200).json({ success: true, message: 'User is logged in', user: req.user });
	} catch (error) {
		const statusCode = error?.status ?? 500;
		const message = error?.message ?? 'Error checking user';
		return res.status(statusCode).json({ success: false, message });
	}
};
/* 
=====================
==== GOOGLE AUTH ====
=====================
*/
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

export async function getGoogleAuthSettings(req, res) {
	const googleAuthURL =
		`https://accounts.google.com/o/oauth2/v2/auth?` +
		querystring.stringify({
			client_id: GOOGLE_CLIENT_ID,
			redirect_uri: GOOGLE_REDIRECT_URI,
			response_type: 'code',
			scope: 'openid profile email',
			access_type: 'offline',
			prompt: 'consent',
		});
	res.json({ url: googleAuthURL });
}

export async function getGoogleAuthCallback(req, res) {
	try {
		const { code } = req.body;
		if (!code) {
			return res.status(400).send('Code not provided.');
		}
		const tokenResponse = await axios.post(
			'https://oauth2.googleapis.com/token',
			querystring.stringify({
				code: code,
				client_id: GOOGLE_CLIENT_ID,
				client_secret: GOOGLE_CLIENT_SECRET,
				redirect_uri: GOOGLE_REDIRECT_URI,
				grant_type: 'authorization_code',
			}),
			{ headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
		);
		// const { access_token, id_token, refresh_token } = tokenResponse.data;
		const { id_token } = tokenResponse.data;
		const userInfo = jwt.decode(id_token);
		let { email, name } = userInfo;
		let user = await db.user.findUnique({ where: { email: HashText(email) } });
		if (!user) {
			user = await db.user.create({ data: { email, password: null, name, role: UserRole.USER, login_type: LoginType.GOOGLE } });
		} else {
			if (user.login_type !== LoginType.GOOGLE) {
				/* if user exists and is email & password */
				throw { status: 400, message: `Use email/password to login` };
			}
		}
		const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
		res.cookie('jwt', token, {
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV !== 'development',
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		});
		const userObject = { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role, image: newUser.image };
		res.status(201).json({ success: true, message: 'User created successfully', user: userObject });
	} catch (error) {
		console.error(error);
		res.status(500).send('Error exchanging code for access token');
	}
}
