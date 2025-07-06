const express = require('express');
const router = new express.Router();
const utilities = require('../utilities/');

const budgetController = require('../controllers/budgetController');

router.get("/", budgetController.buildDashboard);

router.get("/category/create", budgetController.renderCreateCategory);
router.post("/category/create", budgetController.createCategory);
router.get("/category/edit/:cat_id", utilities.checkAuthorizationForCategory, budgetController.renderEditCategory);
router.post("/category/edit/:cat_id", utilities.checkAuthorizationForCategory, budgetController.editCategory);
router.post("/category/delete", utilities.checkAuthorizationForCategory, budgetController.deleteCategory);
// Remove this in the future
router.post("/create-category", budgetController.createCategory);
router.post("/edit-category", budgetController.editCategory);
router.post("/delete-category", budgetController.deleteCategory);

router.get("/sub-category/create", budgetController.renderCreateSubCategory);
router.post("/sub-category/create", budgetController.createSubCategory);
router.get("/sub-category/edit/:sub_id", utilities.checkAuthorization, budgetController.renderEditSubCategory);
router.post("/sub-category/edit/:sub_id", utilities.checkAuthorization, budgetController.editSubCategory);
router.get("/sub-category/delete/:sub_id", utilities.checkAuthorization, budgetController.deleteSubCategory);

// maybe remove this in the future
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

router.get("/settings", budgetController.buildSettings);

router.post("/edit-budget-day", budgetController.changeBudgetResetDay);

module.exports = router;

