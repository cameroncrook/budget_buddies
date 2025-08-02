const budgetModel = require('../database/budgetModels'); 
const statsModel = require('../database/statsModels');
const settingsModel = require('../database/settingsModels');
const utilities = require('../utilities/');
const templates = require('../utilities/templates');

async function buildDashboard(req, res) {
    const bg_id = req.session.user.bg_id;

    const setDay = await settingsModel.getBudgetResetDay(bg_id);
    const dateRanges = utilities.getLogDateRange(setDay);

    const budgetTotals = await statsModel.getBudgetTotals(bg_id, dateRanges);
    const categoryTotals = await statsModel.getCategoryTotals(bg_id, dateRanges);


    const currentInnerBar = templates.buildBudgetProgressBar(budgetTotals);
    const currentLabel = `${budgetTotals.total_expense || 0} / ${budgetTotals.total_budget || 0}`;
    const barHtml = templates.buildCategoryChart(categoryTotals);

    res.render('stats/dashboard', {currentInnerBar, currentLabel, barHtml, styles: '<link rel="stylesheet" href="/css/stats.css">', scripts: ''});
}

module.exports = { buildDashboard };