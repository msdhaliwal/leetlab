import { db } from '../libs/db.js';
import { getJudge0LanguageId, pollBatchResults, submitBatch } from '../libs/judge0.lib.js';

export const createProblem = async (req, res) => {
	try {
		const { title, description, difficulty, tags, input, output, constraints, examples, testCases, codeSnippets, referenceSolutions } = req.body;
		if (req.user.role !== 'ADMIN') {
			throw { status: 403, message: `You are not authorized to create a problem` };
		}
		for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
			const languageId = getJudge0LanguageId(language.toLowerCase());
			if (!languageId) {
				throw { status: 400, message: `Invalid language: ${language}` };
			}
			const submissions = testCases.map(({ input, output }) => ({
				source_code: solutionCode,
				language_id: languageId,
				stdin: input,
				expected_output: output,
			}));
			const submissionResults = await submitBatch(submissions);
			const tokens = submissionResults.map((res) => res.token);
			const results = await pollBatchResults(tokens);
			for (let i = 0; i < results.length; i++) {
				const result = results[i];
				if (result.status.id !== 3) {
					throw { status: 400, message: `Test case ${i + 1} failed for language ${language}` };
				}
			}
		}
		const newProblem = await db.problem.create({ data: { title, description, difficulty, tags, constraints, examples, testCases, codeSnippets, referenceSolutions, userId: req.user.id } });
		return res.status(201).json({ message: 'Problem created successfully', newProblem });
	} catch (error) {
		const statusCode = error?.status ?? 500;
		const message = error?.message ?? 'Error while creating problem';
		return res.status(statusCode).json({ message });
	}
};

export const getAllProblems = async (req, res) => {
	try {
		const problems = await db.problem.findMany({ include: { solvedBy: { where: { userId: req.user.id } } } });

		if (!problems) {
			throw { status: 400, message: `No problems found` };
		}
		return res.status(200).json({ success: true, message: 'Problems fetched successfully', problems });
	} catch (error) {
		const statusCode = error?.status ?? 500;
		const message = error?.message ?? 'Error while fetching problems';
		res.status(statusCode).json({ message, success: false });
	}
};

export const getProblemById = async (req, res) => {
	try {
		const { id } = req.params;
		const problem = await db.problem.findUnique({ where: { id } });

		if (!problem) {
			throw { status: 400, message: `Problem not found` };
		}
		return res.status(200).json({ success: true, message: 'Problem fetched successfully', problem });
	} catch (error) {
		const statusCode = error?.status ?? 500;
		const message = error?.message ?? 'Error while fetching problem';
		res.status(statusCode).json({ message, success: false });
	}
};

export const updateProblemById = async (req, res) => {
	try {
		const { title, description, difficulty, tags, input, output, constraints, examples, testCases, codeSnippets, referenceSolutions } = req.body;
		if (req.user.role !== 'ADMIN') {
			throw { status: 403, message: `You are not authorized to create a problem` };
		}
		for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
			const languageId = getJudge0LanguageId(language.toLowerCase());
			if (!languageId) {
				throw { status: 400, message: `Invalid language: ${language}` };
			}
			const submissions = testCases.map(({ input, output }) => ({
				source_code: solutionCode,
				language_id: languageId,
				stdin: input,
				expected_output: output,
			}));
			const submissionResults = await submitBatch(submissions);
			const tokens = submissionResults.map((res) => res.token);
			const results = await pollBatchResults(tokens);
			for (let i = 0; i < results.length; i++) {
				const result = results[i];
				if (result.status.id !== 3) {
					return res.status(400).json({ error: `Test case ${i + 1} failed for language ${language}` });
				}
			}
		}
		const { id } = req.params;
		const updatedProblem = await db.problem.update({
			where: { id },
			data: { title, description, difficulty, tags, constraints, examples, testCases, codeSnippets, referenceSolutions },
		});
		if (!updatedProblem) {
			return res.status(404).json({ message: 'Problem not found' });
		}
		return res.status(200).json({ success: true, message: 'Problem updated successfully', updatedProblem });
	} catch (error) {
		const statusCode = error?.status ?? 500;
		const message = error?.message ?? 'Error while updating problem';
		res.status(statusCode).json({ message, success: false });
	}
};

export const deleteProblemById = async (req, res) => {
	try {
		const { id } = req.params;
		const deletedProblem = await db.problem.delete({ where: { id } });
		if (!deletedProblem) {
			throw { status: 404, message: `Problem not found` };
		}
		return res.status(200).json({ success: true, message: 'Problem deleted successfully', deletedProblem });
	} catch (error) {
		const statusCode = error?.status ?? 500;
		const message = error?.message ?? 'Error while deleting problem';
		res.status(statusCode).json({ message, success: false });
	}
};

export const getAllProblemsSolvedByUser = async (req, res) => {
	try {
		const problems = await db.problem.findMany({
			where: { solvedBy: { some: { id: req.user.id } } },
			include: { solvedBy: { userId: req.user.id } },
		});
		res.status(200).json({ success: true, message: 'Problems fetched successfully', problems });
	} catch (error) {
		const statusCode = error?.status ?? 500;
		const message = error?.message ?? 'Error while fetching problems solved by user';
		res.status(statusCode).json({ message, success: false });
	}
};
