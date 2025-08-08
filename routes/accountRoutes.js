const express = require('express');
const router = new express.Router();

const accountController = require('../controllers/accountController');

router.get("/login", accountController.buildLogin);
router.post("/login", accountController.login);
router.post("/logout", accountController.logout);

router.get("/register/:shareCode", accountController.buildRegister);
router.post("/register", accountController.register);

router.get("/create-budget", accountController.buildCreateBudget);
router.post("/create-budget", accountController.createBudget);

router.post("/color-theme/edit", accountController.editColorTheme);

module.exports = router;
