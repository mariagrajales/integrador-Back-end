const express = require('express');
const GroupController = require('../controllers/group.controller');
const {verifyToken, verifyTeacher} = require('../middlewares/user.middleware');
const router = express.Router();

router.post('/', verifyToken, verifyTeacher, GroupController.createGroup);
router.get('/:id', verifyToken, verifyTeacher, GroupController.getById);
router.get('/', verifyToken, GroupController.getAll);
router.get('/user/:userId', verifyToken, GroupController.getByUserId);
router.get('/:groupId/users', verifyToken, GroupController.getUsersByGroupId); // Nueva ruta
router.delete('/:id', verifyToken, verifyTeacher, GroupController.deleteGroup);

module.exports = router;
