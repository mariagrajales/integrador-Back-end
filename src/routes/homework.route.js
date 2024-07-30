const express = require('express');
const HomeworkController = require('../controllers/homework.controller');
const { verifyToken, verifyTeacher } = require('../middlewares/user.middleware');
const router = express.Router();

router.post('/', verifyToken, verifyTeacher, HomeworkController.createHomework);
router.get('/:id', verifyToken, verifyTeacher, HomeworkController.getById);
router.get('/', verifyToken, HomeworkController.getAll);
router.delete('/:id', verifyToken, verifyTeacher, HomeworkController.deleteHomework);
router.patch('/:id', verifyToken, verifyTeacher, HomeworkController.patch);
router.get('/date', verifyToken, verifyTeacher, HomeworkController.getByDate);
router.get('/group/:groupId', verifyToken, HomeworkController.getHomeworksByGroupId);

module.exports = router;
