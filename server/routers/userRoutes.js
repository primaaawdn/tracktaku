const router = require("express").Router();
const userController = require("../controllers/userController");
const { adminGuard } = require("../middlewares/adminGuard");
const authentication = require("../middlewares/authentication");

router.post('/register', userController.register);
router.post('/login', userController.login);
router.put('/:id', authentication, userController.updateUser);
router.get('/all', authentication, adminGuard, userController.getAllUsers);
router.get('/:id', authentication, adminGuard, userController.getUserById);
router.delete('/:id', authentication, adminGuard, userController.deleteUser);

module.exports = router;