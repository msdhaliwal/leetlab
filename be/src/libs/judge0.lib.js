import axios from 'axios';

export const getJudge0LanguageId = (language) => {
	const normalized = language.toLowerCase();
	const aliasMap = {
		python: 'python3',
		py: 'python3',
		js: 'javascript',
		nodejs: 'javascript',
	};
	const finalLang = aliasMap[normalized] || normalized;
	const languageMap = { python3: 71, java: 62, javascript: 63 };
	return languageMap[finalLang] || null;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const pollBatchResults = async (tokens) => {
	while (true) {
		const { data } = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`, {
			params: { tokens: tokens.join(','), base64_encoded: false },
		});
		const results = data.submissions;
		const allCompleted = results.every((result) => result.status.id !== 1 && result.status.id !== 2);
		if (allCompleted) return results;
		await sleep(1000);
	}
};

export const submitBatch = async (submissions) => {
	const { data } = await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`, { submissions });
	return data; /* [{token}, ...] */
};

export const getLanguageName = (languageId) => {
	const LANGUAGE_NAMES = { 71: 'Python', 62: 'Java', 63: 'JavaScript' };
	return LANGUAGE_NAMES[languageId] || 'Unknown Language';
};
