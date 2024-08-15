const express = require('express');
const router = express.Router();
const serverController = require('../controllers/serverController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post('/', authMiddleware, roleMiddleware(['GeneralSpecAdmin', 'NetworkAdmin', 'SecurityAdmin']), serverController.createServer);

router.get('/', authMiddleware, serverController.getServers);
router.get('/:id', authMiddleware, serverController.getServerById);
router.put('/:id', authMiddleware, roleMiddleware(['GeneralSpecAdmin', 'NetworkAdmin', 'SecurityAdmin']), serverController.updateServer);
router.delete('/:id', authMiddleware, roleMiddleware('SuperAdmin'), serverController.deleteServer);

module.exports = router;
