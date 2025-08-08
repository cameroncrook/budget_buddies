const settingsModel = require('../database/settingsModels');
const accountModel = require('../database/accountModels');
templates = require('../utilities/templates');

async function buildSettings(req, res) {
    const bg_id = req.session.user.bg_id;

    const shareCode = await settingsModel.getBudgetShareCode(bg_id);
    const budgetAccounts = await settingsModel.getBudgetAccounts(bg_id);
    const budgetAccountsHtml = templates.budgetAccountsTemplate(budgetAccounts);
    const budgetResetDay = await settingsModel.getBudgetResetDay(bg_id);

    const colorMode = await accountModel.getAccountColorMode(req.session.user.account_id);

    return res.render('settings/settings', { shareCode, budgetAccountsHtml, budgetResetDay, scripts: '<script src="/js/budget-settings.js" defer ></script>', styles: '<link rel="stylesheet" href="/css/settings.css" />', colorMode });
}

async function changeBudgetResetDay(req, res) {
    const { bg_budget_reset } = req.body;
    const bg_id = req.session.user.bg_id;
    
    const response = await settingsModel.editBudgetResetDay(bg_budget_reset, bg_id);

    if (response) {
        return res.redirect('/settings');
    } else {
        alert("Failed to update budget reset day");
    }
}

module.exports = {
    buildSettings,
    changeBudgetResetDay
};