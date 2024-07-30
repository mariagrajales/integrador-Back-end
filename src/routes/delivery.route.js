const express = require('express');
const DeliveryController = require('../controllers/delivery.controller');
const { verifyToken, verifyTeacher, verifyTeacherOrStudent } = require('../middlewares/user.middleware');
const router = express.Router();

router.post('/', verifyToken, verifyTeacherOrStudent, DeliveryController.createDelivery);
router.get('/:id', verifyToken, verifyTeacherOrStudent, DeliveryController.getById);
router.get('/', verifyToken, verifyTeacherOrStudent, DeliveryController.getAll);
router.delete('/:id', verifyToken, verifyTeacherOrStudent, DeliveryController.deleteDelivery);
router.patch('/:id', verifyToken, verifyTeacherOrStudent, DeliveryController.patch);
router.patch('/grade/:id', verifyToken, verifyTeacherOrStudent, DeliveryController.patchGrade);
router.get('/date/:date', verifyToken, verifyTeacherOrStudent, DeliveryController.getByDate);
router.get('/user/:userId', verifyToken, verifyTeacherOrStudent, DeliveryController.getByUserId);

module.exports = router;