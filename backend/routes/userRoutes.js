const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/', authMiddleware, roleMiddleware(['SuperAdmin']), userController.getUsers);
router.get('/:id', authMiddleware, roleMiddleware(['SuperAdmin']), userController.getUserById);
router.put('/:id', authMiddleware, roleMiddleware(['SuperAdmin']), userController.updateUser);
router.delete('/:id', authMiddleware, roleMiddleware(['SuperAdmin']), userController.deleteUser);

module.exports = router;
