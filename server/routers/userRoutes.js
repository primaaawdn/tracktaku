const router = require("express").Router();
const userController = require("../controllers/userController");
const authentication = require("../middlewares/authentication");

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/google-login', userController.googleLogin);
router.get('/all', userController.getAllUsers);
router.get('/:id', authentication, userController.getUserById);
router.put('/:id', authentication, userController.updateUser);
router.delete('/:id', authentication, userController.deleteUser);

module.exports = router;