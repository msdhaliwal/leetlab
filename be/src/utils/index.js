import crypto from 'node:crypto';

const ENV = process.env;

export const Decrypt = function (value) {
	const [ivHex, encrypted] = value.split(':');
	// eslint-disable-next-line no-undef
	const iv = Buffer.from(ivHex, 'hex');
	const key = crypto.scryptSync(ENV.ENC_SECRET_KEY, 'salt', 32);
	const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
	let decrypted = decipher.update(encrypted, 'hex', 'utf8');
	decrypted += decipher.final('utf8');
	return decrypted;
};

export const Encrypt = function (value) {
	const iv = crypto.randomBytes(16);
	const key = crypto.scryptSync(ENV.ENC_SECRET_KEY, 'salt', 32);
	const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
	let encrypted = cipher.update(value, 'utf8', 'hex');
	encrypted += cipher.final('hex');
	return `${iv.toString('hex')}:${encrypted}`;
};

export const HashText = (text) => crypto.createHmac('sha256', ENV.ENC_SECRET_KEY).update(text).digest('hex');

export const IsSameHash = (text, hash) => HashText(text) === hash;
