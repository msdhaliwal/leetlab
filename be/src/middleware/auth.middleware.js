import jwt from 'jsonwebtoken';
import { db } from '../libs/db.js';
import { UserRole } from '../generated/prisma/index.js';

export const authMiddleware = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;
		if (!token) {
			throw { status: 401, message: `Unauthorized` };
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
		next();
	} catch (error) {
		const statusCode = error?.status ?? 500;
		const message = error?.message ?? 'Error authenticating user';
		res.status(statusCode).json({ message, success: false });
	}
};

export const checkAdmin = async (req, res, next) => {
	try {
		const userId = req.user.id;
		const user = await db.user.findUnique({
			where: { id: userId },
			select: { role: true },
		});

		if (!user || user.role !== UserRole.ADMIN) {
			throw { status: 403, message: `Access denied - Admins only` };
		}
		next();
	} catch (error) {
		const statusCode = error?.status ?? 500;
		const message = error?.message ?? 'Error checking admin status';
		res.status(statusCode).json({ message, success: false });
	}
};
