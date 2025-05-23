import bcrypt from 'bcryptjs';
import { db } from '../libs/db.js';
import { UserRole } from '../generated/prisma/index.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
	try {
		const { email, password, name } = req.body;
		const userExists = await db.user.findUnique({ where: { email } });
		if (userExists) {
			throw { status: 429, message: `User already exists` };
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = await db.user.create({ data: { email, password: hashedPassword, name, role: UserRole.USER } });
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
		const user = await db.user.findUnique({ where: { email } });
		if (!user) {
			throw { status: 401, message: `Invalid credentials` };
		}
		const isPasswordValid = await bcrypt.compare(password, user.password);
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
		res.status(200).json({ success: true, message: 'User is logged in', user: req.user });
	} catch (error) {
		return res.status(500).json({ success: false, message: 'Error checking user' });
	}
};
