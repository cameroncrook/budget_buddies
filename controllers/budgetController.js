const budgetModel = require('../database/budgetModels');
const utilities = require('../utilities/');
const templates = require('../utilities/templates');

async function buildDashboard(req, res) {
    const user = req.session.user;
    const budget = await budgetModel.getBudgetName(req.session.user.bg_id);
    const totalBudget = await budgetModel.getTotalBudget(req.session.user.bg_id);

    const categories = await budgetModel.getCategories(user.bg_id);

    const resetDay = await budgetModel.getBudgetResetDay(req.session.user.bg_id);
    console.log(resetDay);
    const dateRanges = utilities.getLogDateRange(resetDay);
    console.log(dateRanges);
    const categoryCards = await utilities.buildCategoryCards(categories, dateRanges);

    res.render('budget/dashboard', { budget_name: budget, total: totalBudget, categoryCards });
}

async function createCategory(req, res) {
    const { cat_name, cat_color } = req.body;

    const user = req.session.user;

    const response = await budgetModel.addCategory(cat_name, cat_color, user.bg_id);

    if (response) {
        res.redirect("/budget/");
    } else {
        console.log("failed");
        res.redirect("/budget/");
    }
}

async function editCategory(req, res) {
    const { cat_id, cat_name, cat_color } = req.body;

    const response = await budgetModel.editCategory(cat_id, cat_name, cat_color);

    res.redirect("/budget/");
}

async function deleteCategory(req, res) {
    const { cat_id } = req.body;

    const response = await budgetModel.deleteCategory(cat_id);

    res.status(201).send("success");
}


async function createSubCategory(req, res) {
    const { cat_id, sub_name, sub_budget } = req.body;

    const response = await budgetModel.addSubCategory(cat_id, sub_name, sub_budget);

    res.redirect("/budget/");
}

async function deleteSubCategory(req, res) {
    // const { sub_id } = req.body;
    const sub_id = req.params.sub_id;

    const response = await budgetModel.removeSubCategory(sub_id);

    res.status(201).send("success");
}

async function updateSubCategory(req, res) {
    const { sub_id, sub_name, sub_budget } = req.body;

    const response = await budgetModel.editSubCategory(sub_id, sub_name, sub_budget);

    res.redirect(`/budget/logs/${sub_id}`);
}

async function getSubCategories(req, res) {
    const cat_id = req.params.cat_id;

    const resetDay = await budgetModel.getBudgetResetDay(req.session.user.bg_id);
    const dateRanges = utilities.getLogDateRange(resetDay);
    const response = await budgetModel.getSubCategories(cat_id, dateRanges);

    res.json(response);
}

async function buildLog(req, res) {
    const bg_id = req.session.user.bg_id;
    const budget = await budgetModel.getBudgetName(req.session.user.bg_id);

    const categories = await budgetModel.getCategories(bg_id);

    const category_options = utilities.buildCategoryOptions(categories);

    res.render('budget/log', { budget_name: budget, category_options});
}

async function createLog(req, res) {
    const {sub_id, exp_for, exp_description, exp_date, exp_cost} = req.body;

    const account_id = req.session.user.account_id;

    const response = await budgetModel.addLog(sub_id, exp_for, exp_description, exp_date, exp_cost, account_id);

    res.redirect("/budget/log");
}

async function removeLog(req, res) {

}

async function editLog(req, res) {

}

async function buildLogs(req, res) {
    const sub_id = req.params.sub_id;
    const budget = await budgetModel.getBudgetName(req.session.user.bg_id);

    const resetDay = await budgetModel.getBudgetResetDay(req.session.user.bg_id);
    const dateRanges = utilities.getLogDateRange(resetDay);
    const logsData = await budgetModel.getLogs(sub_id, dateRanges);

    const logElements = utilities.buildLogEntries(logsData);

    res.render('budget/logs', { logElements, sub_id, budget_name: budget })
}

async function getShareCode(req, res) {
    const bg_id = req.session.user.bg_id;

    const shareCode = await budgetModel.getBudgetShareCode(bg_id);

    res.json({shareCode: shareCode.bg_sharecode});
}

async function renderBudgetEdit(req, res) {
    const sub_id = req.params.sub_id;
    const budget = await budgetModel.getBudgetName(req.session.user.bg_id);

    const budget_data = await budgetModel.getSubCategory(sub_id);

    let sub_budget = budget_data.sub_budget.replace('$', '');
    sub_budget = parseInt(sub_budget);

    res.render('budget/editSubCategory', { name: budget_data.sub_name, budget: sub_budget, budget_name: budget, id: sub_id })
}

async function buildSettings(req, res) {
    const bg_id = req.session.user.bg_id;

    const budget = await budgetModel.getBudgetName(bg_id);
    const shareCode = await budgetModel.getBudgetShareCode(bg_id);
    const budgetAccounts = await budgetModel.getBudgetAccounts(bg_id);
    const budgetAccountsHtml = templates.budgetAccountsTemplate(budgetAccounts);
    const budgetResetDay = await budgetModel.getBudgetResetDay(bg_id);

    return res.render('budget/settings', { budget_name: budget, shareCode, budgetAccountsHtml, budgetResetDay });
}

async function changeBudgetResetDay(req, res) {
    const { bg_budget_reset } = req.body;
    const bg_id = req.session.user.bg_id;
    
    const response = await budgetModel.editBudgetResetDay(bg_budget_reset, bg_id);

    if (response) {
        return res.redirect('/budget/settings');
    } else {
        alert("Failed to update budget reset day");
    }
}

module.exports = { buildDashboard, buildLog, createCategory, editCategory, deleteCategory, createSubCategory, deleteSubCategory, updateSubCategory, getSubCategories, getShareCode, createLog, removeLog, editLog, buildLogs, renderBudgetEdit, buildSettings, changeBudgetResetDay };
