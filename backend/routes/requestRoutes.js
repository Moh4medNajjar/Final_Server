const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware);

router.post('/', requestController.createRequest);
router.get('/', requestController.getRequests);
router.get('/:id', requestController.getRequestById);
router.put('/:id', requestController.updateRequest);
router.delete('/:id', requestController.deleteRequest);

router.get('/user/:userId', requestController.getRequestsByUserId);

router.patch('/:id/reject', roleMiddleware(['GeneralSpecAdmin', 'SuperAdmin']),requestController.rejectRequest);

router.put('/:id/approve', roleMiddleware(['GeneralSpecAdmin', 'SuperAdmin']), requestController.updateRequest);
// router.put('/:id/approve/general',  roleMiddleware('GeneralSpecAdmin'),requestController.approveByGeneralSpecAdmin);
router.put('/:id/approve/network', roleMiddleware('NetworkAdmin'), requestController.approveByNetworkAdmin);
router.put('/:id/approve/security', roleMiddleware('SecurityAdmin'), requestController.approveBySecurityAdmin);

module.exports = router;
