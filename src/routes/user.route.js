const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const {verifyToken} = require('../middlewares/user.middleware');

router.get('/', verifyToken, userController.getAll);
router.post('/', userController.register);
router.post('/login', userController.login);
router.post('/logout', verifyToken, userController.logout);
router.get('/profile', verifyToken, userController.getUserProfile); // Nueva ruta
router.get('/:id', verifyToken, userController.getById);
router.patch('/:id', verifyToken, userController.patch);
router.put('/:id', verifyToken, userController.put);
router.delete('/:id', verifyToken, userController.deleteById);

module.exports = router;
