const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/', authMiddleware, roleMiddleware(['SuperAdmin']), userController.getUsers);

router.get('/ordinary', authMiddleware, roleMiddleware(['SuperAdmin']), userController.getNumberOfOrdinaryUsers);
router.get('/super', authMiddleware, roleMiddleware(['SuperAdmin']), userController.getNumberOfSuperAdmins);
router.get('/network', authMiddleware, roleMiddleware(['SuperAdmin']), userController.getNumberOfNetworkAdmins);
router.get('/general', authMiddleware, roleMiddleware(['SuperAdmin']), userController.getNumberOfGeneralAdmins);


router.get('/:id', authMiddleware, userController.getUserById);
router.put('/:id', authMiddleware, roleMiddleware(['SuperAdmin']), userController.updateUser);
router.delete('/:id', authMiddleware, roleMiddleware(['SuperAdmin']), userController.deleteUser);

module.exports = router;
