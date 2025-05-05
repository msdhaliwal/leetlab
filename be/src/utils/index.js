import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const generateToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

export const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

export const hashString = async (string) => await bcrypt.hash(string, 10);

export const matchPassword = async (existingString, userString) => await bcrypt.compare(existingString, userString);

export const isNull = (value) => value === null || value === undefined || value?.trim() === '';

export const isNullObject = (value) => typeof value !== 'object' || value === null || Object.keys(value).length === 0;

export const isNullArray = (value) => (Array.isArray(value) && value.length === undefined) || value.length === 0;

export function getMissingFields(fields) {
	return Object.entries(fields)
		// .filter(([_, value]) => value === null || value === undefined || (typeof value === 'string' && value.trim() === '') || (Array.isArray(value) && value.length === 0))
		.filter(([_, value]) => isNull(value) && isNullArray(value) && isNullObject(value))
		.map(([key]) => key);
}
