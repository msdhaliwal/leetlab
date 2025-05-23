import { db } from '../libs/db.js';

export const getAllSubmission = async (req, res) => {
	try {
		const userId = req.usser.id;
		const submissions = await db.submission.findMany({ where: { userId: userId } });
		if (submissions.length === 0) {
			throw { status: 404, message: `No submissions found` };
		}
		res.status(200).json({ success: true, message: 'Submissions fetched successfully', submissions: submissions });
	} catch (error) {
		const statusCode = error?.status ?? 500;
		const message = error?.message ?? 'Failed to fetch submissions';
		res.status(statusCode).json({ message, success: false });
	}
};

export const getSubmissionsForProblem = async (req, res) => {
	try {
		const problemId = req.params.problemId;
		const userId = req.user.id;
		const submissions = await db.submission.findMany({ where: { problemId: problemId, userId: userId } });
		res.status(200).json({ success: true, message: 'Submissions fetched successfully', submissions: submissions });
	} catch (error) {
		const statusCode = error?.status ?? 500;
		const message = error?.message ?? 'Failed to fetch submissions';
		res.status(statusCode).json({ message, success: false });
	}
};

export const getAllTheSubmissionsForProblem = async (req, res) => {
	try {
		const problemId = req.params.problemId;
		const submission = await db.submission.count({ where: { problemId: problemId } });
		res.status(200).json({ success: true, message: 'Submissions fetched successfully', count: submission });
	} catch (error) {
		res.status(500).json({ message: 'Failed to fetch submissions', success: false });
	}
};
