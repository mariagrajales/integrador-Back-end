const express = require('express');
const Student_groupController = require('../controllers/student_group.controller');
const {verifyToken, verifyTeacher} = require('../middlewares/user.middleware');
const router = express.Router();

router.post('/', verifyToken, verifyTeacher, Student_groupController.createStudent_group);
router.get('/:id', verifyToken, verifyTeacher, Student_groupController.getById);
router.get('/', verifyToken, Student_groupController.getAll);
router.delete('/:id', verifyToken, verifyTeacher, Student_groupController.deleteStudent_group);
router.get('/user/:userId', verifyToken, Student_groupController.getByUserId);



module.exports = router;