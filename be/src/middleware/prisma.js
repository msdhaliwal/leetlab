import { PrismaClient } from '../generated/prisma/index.js';

import { HashText, Decrypt, Encrypt } from '../utils/index.js';

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
	if (params.model === 'User' && ['create', 'update'].includes(params.action)) {
		const data = params.args.data;
		/* password */
		if (data.password) {
			data.password = HashText(data.password);
		}
		/* email */
		if (data.email) {
			data.email_enc = Encrypt(data.email);
			data.email = HashText(data.email);
		}
	} else if (params.model === 'User' && ['findUnique', 'findFirst', 'findMany'].includes(params.action)) {
		const result = await next(params);
		const decryptEmail = (user) => {
			if (user && user.email_enc) {
				user.email = Decrypt(user.email_enc);
			}
			if (user) {
				delete user.email_enc;
				delete user.email;
			}
			return user;
		};

		if (Array.isArray(result)) {
			return result.map(decryptEmail);
		} else {
			return decryptEmail(result);
		}
	}
	return next(params);
});

export const db = prisma;
