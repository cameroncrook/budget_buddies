const budgetModel = require('../database/budgetModels'); 
const statsModel = require('../database/statsModels');
const utilities = require('../utilities/');
const templates = require('../utilities/templates');

async function buildDashboard(req, res) {
    const budget = await budgetModel.getBudgetName(req.session.user.bg_id);
    const bg_id = req.session.user.bg_id;

    const budgetData = await statsModel.getBudgetData(bg_id);
    const budgetLabels = budgetData.map(category => category.cat_name);
    const budgetValues = budgetData.map(category => category.total);
    const budgetColors = budgetData.map(category => category.cat_color);

    const budgetTotal = await statsModel.getTotalBudget(bg_id);

    const chartData = {
        labels: budgetLabels,
        values: budgetValues,
        colors: budgetColors
    };

    res.render('stats/dashboard', {budget_name: budget, chartData, budgetTotal});
}

module.exports = { buildDashboard };