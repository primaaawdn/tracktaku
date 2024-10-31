const router = require("express").Router();
const userController = require("../controllers/userController");
const { adminGuard } = require("../middlewares/adminGuard");
const authentication = require("../middlewares/authentication");

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/google-login', userController.googleLogin);
router.get('/all', userController.getAllUsers);
router.put('/:id', authentication, userController.updateUser);
router.get('/:id', authentication, adminGuard, userController.getUserById);
router.delete('/:id', authentication, adminGuard, userController.deleteUser);

module.exports = router;