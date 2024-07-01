const express = require('express');
const router = new express.Router();
const utilities = require('../utilities/');

const budgetController = require('../controllers/budgetController');

router.get("/", budgetController.buildDashboard);
router.post("/create-category", budgetController.createCategory);
router.post("/edit-category", budgetController.editCategory);
router.post("/delete-category", budgetController.deleteCategory);

router.post("/create-sub-category", budgetController.createSubCategory);
router.delete("/remove-sub/:sub_id", utilities.checkAuthorization, budgetController.deleteSubCategory);
router.post("/edit-sub-category", budgetController.updateSubCategory);
router.get("/get-sub-categories/:cat_id", budgetController.getSubCategories);

router.get("/log", budgetController.buildLog);
router.post("/create-log", budgetController.createLog);
router.post("/remove-log", budgetController.removeLog);
router.post("/edit-log", budgetController.editLog);

router.get("/budget-edit/:sub_id", utilities.checkAuthorization, budgetController.renderBudgetEdit);

router.get("/logs/:sub_id", utilities.checkAuthorization, budgetController.buildLogs);

router.get("/get-share-code", budgetController.getShareCode);

module.exports = router;

