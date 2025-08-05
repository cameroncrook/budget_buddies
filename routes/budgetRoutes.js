const express = require('express');
const router = new express.Router();
const utilities = require('../utilities/');

const budgetController = require('../controllers/budgetController');

router.get("/", budgetController.buildDashboard);

router.get("/category/create", budgetController.renderCreateCategory);
router.post("/category/create", budgetController.createCategory);
router.get("/category/edit/:cat_id", utilities.checkAuthorizationForCategory, budgetController.renderEditCategory);
router.post("/category/edit/:cat_id", utilities.checkAuthorizationForCategory, budgetController.editCategory);
router.post("/category/delete/:cat_id", utilities.checkAuthorizationForCategory, budgetController.deleteCategory);

router.get("/sub-category/create", budgetController.renderCreateSubCategory);
router.post("/sub-category/create", budgetController.createSubCategory);
router.get("/sub-category/edit/:sub_id", utilities.checkAuthorization, budgetController.renderEditSubCategory);
router.post("/sub-category/edit/:sub_id", utilities.checkAuthorization, budgetController.editSubCategory);
router.post("/sub-category/delete/:sub_id", utilities.checkAuthorization, budgetController.deleteSubCategory);
router.get("/:slug", budgetController.renderSubCategory);

// Route to get sub-categories for log page
router.get("/get-sub-categories/:cat_id", budgetController.getSubCategories);

router.get("/log/add", budgetController.buildLog);
router.post("/log/add", budgetController.createLog);
router.post("/log/delete/:log_id", budgetController.removeLog);
router.post("/log/edit/:log_id", budgetController.editLog);

module.exports = router;

