const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware);

router.post('/', requestController.createRequest);
router.get('/', requestController.getRequests);

router.get('/approved', requestController.getNumberOfApprovedRequests);
router.get('/rejected', requestController.getNumberOfRejectedRequests);
router.get('/finished', requestController.getNumberOfFinishedRequests);
router.get('/pending', requestController.getNumberOfPendingRequests);
router.get('/all', requestController.getNumberOfRequests);

router.get('/:id', requestController.getRequestById);
router.put('/:id', requestController.updateRequest);
router.delete('/:id',roleMiddleware('SuperAdmin'), requestController.deleteRequest);

router.get('/user/:userId', requestController.getRequestsByUserId);

router.put('/:id/reject', roleMiddleware(['GeneralSpecAdmin', 'SuperAdmin']),requestController.updateRequest);

router.put('/:id/approve', roleMiddleware(['GeneralSpecAdmin', 'SuperAdmin']), requestController.updateRequest);
// router.put('/:id/approve/general',  roleMiddleware('GeneralSpecAdmin'),requestController.approveByGeneralSpecAdmin);
router.put('/:id/approve/network', roleMiddleware('NetworkAdmin'), requestController.approveByNetworkAdmin);
router.put('/:id/approve/security', roleMiddleware('SecurityAdmin'), requestController.approveBySecurityAdmin);

module.exports = router;
