const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post('/', authMiddleware, requestController.createRequest);
router.get('/', authMiddleware, requestController.getRequests);
router.get('/:id', authMiddleware, requestController.getRequestById);
router.put('/:id', authMiddleware, requestController.updateRequest);
router.delete('/:id', authMiddleware, requestController.deleteRequest);

router.get('/user/:userId', requestController.getRequestsByUserId);

router.patch('/:id/reject', authMiddleware, requestController.rejectRequest);

router.put('/:id/approve/general', authMiddleware, requestController.approveByGeneralSpecAdmin);
router.put('/:id/approve/network', authMiddleware, roleMiddleware('NetworkAdmin'), requestController.approveByNetworkAdmin);
router.put('/:id/approve/security', authMiddleware, roleMiddleware('SecurityAdmin'), requestController.approveBySecurityAdmin);

module.exports = router;
