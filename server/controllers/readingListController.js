const { ReadingList } = require("../models");

exports.addMangaToList = async (req, res, next) => {
	const userId = req.user.userId;
	const { mangaId } = req.body;

	try {
		const [entry, created] = await ReadingList.findOrCreate({
			where: { userId, mangaId },
			defaults: {
				status: "To Read",
				progress: 0,
				userRating: null,
			},
		});

		if (!created) {
			return res
				.status(400)
				.json({ message: "This manga is already on your reading list" });
		}

		res
			.status(201)
			.json({ message: "Manga has been added to your list", entry });
	} catch (error) {
		console.error("Error adding manga to list:", error);
		next(error);
	}
};

exports.removeMangaFromList = async (req, res, next) => {
	const userId = req.user.userId;
	const { mangaId } = req.params;
  
	try {
	  const entry = await ReadingList.findOne({ where: { userId, mangaId } });
  
	  if (!entry) {
		return res.status(404).json({ message: "Manga not found in your reading list" });
	  }
  
	  await entry.destroy();
  
	  return res.status(200).json({ message: "Manga has been removed from your list" });
	} catch (error) {
	  console.error("Error removing manga from list:", error);
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
