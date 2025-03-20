const express = require('express');
const router = new express.Router();
const utilities = require('../utilities/');
const statsController = require('../controllers/statsController');

router.get("/", statsController.buildDashboard);

module.exports = router;