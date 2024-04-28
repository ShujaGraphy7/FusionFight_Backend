const express = require('express');
const router = express.Router();
const airdropController = require('../controllers/airdropController');

router.get('/claim/:walletAddress', airdropController.claimAirdrop);
router.get('/balance', airdropController.getBalance);
router.get('/balanceOf/:walletAddress', airdropController.getBalanceOf);

module.exports = router;
