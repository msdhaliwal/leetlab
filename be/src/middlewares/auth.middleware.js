import { UserRole } from '../generated/prisma/index.js';
import { isNull, verifyToken } from '../utils/index.js';

export const ValidateLogin = (req, res, next) => {
	try {
		const token = req.cookies.token;
		if (isNull(token)) {
			throw { status: 401, message: `Unauthorized` };
		}
		let decoded;
		try {
			decoded = verifyToken(token);
		} catch (error) {
			throw { status: 401, message: `Unauthorized` };
		}
		const user = db.user.findUnique({
			where: { id: decoded.id },
			select: { id: true, email: true, role: true, name: true, image: true },
		});
		if (isNull(user)) {
			throw { status: 401, message: `Unauthorized` };
		}
		req.user = user;
		next();
	} catch (err) {
		const status = err.status || 500;
		const message = err.message || 'Something went wrong';
		return res.status(status).json({ success: false, message });
	}
};

export const CheckAdmin = (req, res, next) => {
	try {
		const user = req.user;
		if (user.role !== UserRole.ADMIN) {
			return res.status(403).json({ message: 'Access denied - Admins only' });
		}
		next();
	} catch (err) {
		const status = err.status || 500;
		const message = err.message || 'Something went wrong';
		return res.status(status).json({ success: false, message });
	}
};
