import { db } from '../libs/db.js';

export const getAllPlaylistDetails = async (req, res) => {
	try {
		const playlist = await db.playlist.findMany({
			where: { id: req.user.id },
			include: { problems: { include: { problem: true } } },
		});

		if (submissions.length === 0) {
			throw { status: 204 }; // No playlist found
		}

		res.status(200).json({ success: true, message: 'Successfully fetched playlist', playlist: playlist });
	} catch (error) {
		const statusCode = error?.status ?? 500;
		const message = error?.message ?? 'Error fetching playlist';
		res.status(statusCode).json({ success: false, message });
	}
};

export const getPlaylistDetails = async (req, res) => {
	try {
		const playlistId = req.params.id;
		const userId = req.user.id;
		const playlist = await db.playlist.findUnique({
			where: { id: playlistId, userId },
			include: { problems: { include: { problem: true } } },
		});
		if (!playlist) {
			throw { status: 404, message: 'playlist not found' };
		}
		res.status(200).json({ success: true, message: 'playlist fetched successfully', playlist });
	} catch (error) {
		const statusCode = error?.status ?? 500;
		const message = error?.message ?? 'Error getting playlist details';
		res.status(statusCode).json({ message, success: false });
	}
};

export const createPlaylist = async (req, res) => {
	try {
		const { title, description } = req.body;
		const userId = req.user.id;
		const playlist = await db.playlist.create({ data: { title, description, userId } });
		res.status(200).json({ success: true, message: 'playlist created successfully', playlist });
	} catch (error) {
		console.error('Error creating playlist', error);
		res.status(500).json({ message: 'Failed to create playlist', success: false });
	}
};

export const addProblemToPlaylist = async (req, res) => {
	try {
		const playlistId = req.params.playlistId;
		const { problemIds } = req.body;
		if (!Array.isArray(problemIds) || problemIds.length === 0) {
			throw { status: 400, message: `Invalid or missing problemIds` };
		}

		const problemsInPlaylist = await db.problemsInPlaylist.createMany({
			data: problemIds.map((problemId) => {
				problemId, playlistId;
			}),
		});

		res.status(200).json({ success: true, message: 'Problems added to playlist successfully', problemsInPlaylist });
	} catch (error) {
		const statusCode = error?.status ?? 500;
		const message = error?.message ?? 'Error adding problem in playlist';
		res.status(statusCode).json({ message, success: false });
	}
};

export const deletePlaylist = async (req, res) => {
	try {
		const playlistId = req.params;
		const playlist = await db.playlist.delete({ where: { id: playlistId } });

		res.status(200).json({ success: true, message: 'playlist deleted successfylly', playlist });
	} catch (error) {
		res.status(500).json({ message: 'Failed to delete playlist' });
	}
};

export const removeProblemFromPlaylist = async (req, res) => {
	try {
		const { playlistId } = req.params;
		const { problemIds } = req.body;
		if (!Array.isArray(problemIds) || problemIds.length === 0) {
			throw { status: 400, message: `Invalid or missing problemsId` };
		}
		const deletedProblem = await db.problemsInPlaylist.deleteMany({ where: { playlistId, problemId: { in: problemIds } } });
		res.status(200).json({ success: true, message: 'Problem removed from playlist successfully', deletedProblem });
	} catch (error) {
		const statusCode = error?.status ?? 500;
		const message = error?.message ?? 'Error removing problem from playlist';
		res.status(statusCode).json({ message, success: false });
	}
};
