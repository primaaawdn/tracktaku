const { Manga, User, ReadingList } = require("../models");

exports.getManga = async (req, res, next) => {
	try {
		const manga = await Manga.findAll({
			attributes: ["id", "title", "altTitles", "description", "status", "year", "contentRating"],
			include: [
				{
					model: Tag,
					as: 'tags',
					attributes: ['name'],
				}
			]
		});
		res.status(200).json(manga);
	} catch (error) {
		next(error);
	}
};


exports.getMangaById = async (req, res, next) => {
	try {
		const id = parseInt(req.params.id);
		const manga = await Manga.findByPk(id, {
			attributes: ["id", "title", "altTitles", "description", "status", "year", "contentRating", "links"],
			include: [
				{
					model: Tag,
					as: 'tags',
					attributes: ['name'],
				}
			]
		});

		if (!manga) {
			return next({ name: "NotFound", message: "Manga not found" });
		}

		res.status(200).json(manga);
	} catch (error) {
		next(error);
	}
};


exports.addMangaToList = async (req, res) => {
	const { mangaId } = req.body;
	const userId = req.user.userId;

	try {
		const existingEntry = await ReadingList.findOne({
			where: { userId, mangaId },
		});

		if (existingEntry) {
			next({
				name: "BadRequest",
				message: "You already add this manga on your list",
			});
			return;
		}

		const newEntry = await ReadingList.create({
			userId,
			mangaId,
			status: "To Read",
			progress: 0,
		});

		return res.status(201).json(newEntry);
	} catch (error) {
		next(error);
	}
};

exports.removeMangaFromList = async (req, res) => {
	const { mangaId } = req.params;
	const userId = req.user.userId;

	try {
		const entry = await ReadingList.findOne({ where: { userId, mangaId } });

		if (!entry) {
			next({ name: "NotFound", message: "Manga not found" });
			return;
		}

		await entry.destroy();
		return res
			.status(200)
			.json({ message: "Manga is removed from your list" });
	} catch (error) {
		next(error);
	}
};

exports.updateProgress = async (req, res) => {
	const { mangaId, progress } = req.body;
	const userId = req.user.userId;

	try {
		const entry = await ReadingList.findOne({ where: { userId, mangaId } });

		if (!entry) {
			next({ name: "NotFound", message: "Manga not found" });
			return;
		}

		entry.progress = progress;
		if (progress > 0) {
			entry.status = "Reading";
		}
		await entry.save();

		return res.status(200).json(entry);
	} catch (error) {
		next(error);
	}
};

exports.rateManga = async (req, res) => {
	const { mangaId, rating } = req.body;
	const userId = req.user.userId;

	try {
		const entry = await ReadingList.findOne({ where: { userId, mangaId } });

		if (!entry) {
			next({ name: "NotFound", message: "Manga not found" });
			return;
		}

		entry.userRating = rating;
		await entry.save();

		return res.status(200).json(entry);
	} catch (error) {
		next(error);
	}
};

exports.finishReading = async (req, res) => {
	const { mangaId } = req.body;
	const userId = req.user.userId;

	try {
		const entry = await ReadingList.findOne({ where: { userId, mangaId } });

		if (!entry) {
			next({ name: "NotFound", message: "Manga not found" });
			return;
		}

		entry.status = "Finished Reading";
		await entry.save();

		return res.status(200).json(entry);
	} catch (error) {
		next(error);
	}
};

exports.getMyList = async (req, res) => {
	const userId = req.user.userId;

	try {
		const myList = await ReadingList.findAll({
			where: { userId },
			include: [
				{
					model: Manga,
					attributes: ["id", "title", "description", "status"],
				},
			],
		});

		return res.status(200).json(myList);
	} catch (error) {
		next(error);
	}
};
