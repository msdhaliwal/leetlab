import { db } from '../config/db.js';
import { UserRole } from '../generated/prisma/index.js';
import { generateToken, getMissingFields, hashString, isNull, isNullArray, isNullObject, matchPassword } from '../utils/index.js';

export const RegisterUser = async function (req, res) {
	const { email, password, name } = req.body;
	try {
		const missing = getMissingFields({ email, password, name });
		if (!isNullArray(missing)) {
			throw { status: 400, message: `Missing required params: ${missing.join(', ')}` };
		}
		/* check if user exists */
		const exists = await db.user.findUnique({ where: { email } });
		if (exists) {
			throw { status: 400, message: `User already exists` };
		}
		/* hash password */
		const hashedPassword = await hashString(password);
		/* create user */
		const user = await db.user.create({
			data: { email, name, password: hashedPassword, role: UserRole.USER },
		});
		/* generate jwt token */
		const token = generateToken({ id: user.id });
		/* adding cookie to response */
		res.cookie('token', token, {
			httpOnly: true,
			sameSite: true,
			secure: process.env.NODE_ENV !== 'development',
			maxAge: 1000 * 60 * 60 * 24 * 7,
		});
		res.status(201).json({
			success: true,
			message: 'User created successfully',
			data: {
				id: user.id,
				email: user.email,
				name: user.name,
				role: user.role,
				image: user.image,
			},
		});
	} catch (err) {
		const status = err.status || 500;
		const message = err.message || 'Something went wrong';
		return res.status(status).json({ success: false, message });
	}
};

export const LoginUser = async function (req, res) {
	const { email, password } = req.body;
	try {
		const missing = getMissingFields({ email, password });
		if (!isNullArray(missing)) {
			throw { status: 400, message: `Missing required params: ${missing.join(', ')}` };
		}
		/* check if user exists */
		const user = await db.user.findUnique({ where: { email } });
		if (isNullObject(user)) {
			throw { status: 400, message: `Invalid credentials` };
		}
		/* check password */
		const isMatch = await matchPassword(password, user.password);
		if (!isMatch) {
			throw { status: 400, message: `Invalid credentials` };
		}
		/* generate jwt token */
		const token = generateToken({ id: user.id });
		/* adding cookie to response */
		res.cookie('token', token, {
			httpOnly: true,
			sameSite: true,
			secure: process.env.NODE_ENV !== 'development',
			maxAge: 1000 * 60 * 60 * 24 * 7,
		});
		res.status(200).json({
			success: true,
			message: 'Login successful',
			data: {
				id: user.id,
				email: user.email,
				name: user.name,
				role: user.role,
				image: user.image,
			},
		});
	} catch (err) {
		const status = err.status || 500;
		const message = err.message || 'Something went wrong';
		return res.status(status).json({ success: false, message });
	}
};

export const LogoutUser = function (req, res) {
	try {
		res.clearCookie('token');
		res.status(200).json({ success: true });
	} catch (err) {
		const status = err.status || 500;
		const message = err.message || 'Something went wrong';
		return res.status(status).json({ success: false, message });
	}
};

export const GetUser = function (req, res) {
	try {
		res.status(200).json({ success: true });
	} catch (err) {
		const status = err.status || 500;
		const message = err.message || 'Something went wrong';
		return res.status(status).json({ success: false, message });
	}
};
