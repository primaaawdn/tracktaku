const router = require("express").Router();
const userController = require("../controllers/userController");
// const { adminGuard } = require("../middlewares/isAdmin");
// const authentication = require("../middlewares/authentication");

router.post('/login', userController.login);
router.post('/register', userController.register);

module.exports = router;