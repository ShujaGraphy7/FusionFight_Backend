const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/getAllUsers', userController.getAllUsers);
router.post('/registerUser', userController.registerUser);
router.post('/updateWonMatch/:walletAddress', userController.updateWonMatch);
router.post('/updateLostMatch/:walletAddress', userController.updateLostMatch);
router.get('/getUserDetails/:walletAddress', userController.getUserDetails);
router.post('/updateUserPoints/:walletAddress', userController.updateUserPoints);

router.get('/isEligible/:walletAddress', userController.isEligible);

module.exports = router;
