const express = require('express');
const router = express.Router();
const serverController = require('../controllers/serverController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post('/', authMiddleware, roleMiddleware(['NetworkAdmin', 'SuperAdmin']), serverController.createServer);

router.get('/', authMiddleware, roleMiddleware(['GeneralSpecAdmin', 'NetworkAdmin', 'SuperAdmin']), serverController.getServers);
router.get('/user/:requesterId', authMiddleware, serverController.getServersByUserId);
router.get('/:id', authMiddleware, serverController.getServerById);

// router.get('/wantToDelete', serverController.getDeletableServers);

router.put('/:id', authMiddleware, roleMiddleware(['GeneralSpecAdmin', 'NetworkAdmin']), serverController.updateServer);

router.patch('/:id/request-delete', authMiddleware, serverController.requestRemoveRequest);

router.delete('/:id', authMiddleware, roleMiddleware('SuperAdmin'), serverController.deleteServer);

module.exports = router;
