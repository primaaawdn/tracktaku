const router = require("express").Router();
const mangaController = require("../controllers/mangaController");
const authentication = require("../middlewares/authentication");

router.get('/', mangaController.getManga);
router.get('/mylist', authentication, mangaController.getMyList);
router.post('/add', authentication, mangaController.addMangaToList);
router.put('/progress', authentication, mangaController.updateProgress);
router.put('/rate', authentication, mangaController.rateManga);
router.put('/finish', authentication, mangaController.finishReading);
router.delete('/:id', authentication, mangaController.removeMangaFromList);
router.get('/:id', authentication, mangaController.getMangaById);

module.exports = router;