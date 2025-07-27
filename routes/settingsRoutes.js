const express = require('express');
const router = new express.Router();
const settingsControler = require('../controllers/settingsController');
const utilities = require('../utilities/');

router.get("/", settingsControler.buildSettings);
router.post("/edit-budget-day", settingsControler.changeBudgetResetDay);

module.exports = router;