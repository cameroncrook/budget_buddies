const budgetModel = require('../database/budgetModels'); 
const statsModel = require('../database/statsModels');
const settingsModel = require('../database/settingsModels');
const accountModel = require('../database/accountModels');
const utilities = require('../utilities/');
const templates = require('../utilities/templates');

async function buildDashboard(req, res) {
    const bg_id = req.session.user.bg_id;
    const colorMode = await accountModel.getAccountColorMode(req.session.user.account_id);

    const setDay = await settingsModel.getBudgetResetDay(bg_id);
    const dateRanges = utilities.getLogDateRange(setDay);

    const budgetTotals = await statsModel.getBudgetTotals(bg_id, dateRanges);
    const categoryTotals = await statsModel.getCategoryTotals(bg_id, dateRanges);


    const currentInnerBar = templates.buildBudgetProgressBar(budgetTotals);
    const currentLabel = `${budgetTotals.total_expense || 0} / ${budgetTotals.total_budget || 0}`;
    const barHtml = templates.buildCategoryChart(categoryTotals);

    // Balances
    const balances = await budgetModel.getBalances(bg_id);
    balances.forEach((item) => {
        item.balance_date = new Date(item.balance_date).toLocaleDateString();
    });
    const balanceChartData = utilities.getChartData('balance_date', 'balance_amount', balances, 5);
    const balanceChart = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify({
        type: 'line',
        data: {
            labels: balanceChartData.labels.reverse(),
            datasets: [
            {
                label: 'Balance',
                data: balanceChartData.values.reverse()
            }
            ]
        }
    }))}`;

    const balanceEntries = templates.buildBalanceEntries(balances);

    res.render('stats/dashboard', {currentInnerBar, currentLabel, barHtml, balanceChart, balanceEntries, styles: '<link rel="stylesheet" href="/css/stats.css">', scripts: '<script src="/js/stats.js" defer></script>', colorMode});
}

module.exports = { buildDashboard };