const budgetModel = require("../database/budgetModels");

function requireLogin(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        return res.redirect("/");
    }
}

async function checkAuthorization(req, res, next) {
    const sub_id = req.params.sub_id;

    const target_id = await budgetModel.getBudgetIdFromSub(sub_id);
    const authorized_id = req.session.user.bg_id;

    if (target_id.bg_id == authorized_id) {
        next();
    } else {
        return res.redirect("/budget/");
    }
}

async function buildCategoryCards(categories) {
    let html = '';
    for (const category of categories) {
        const budgets = await budgetModel.getSubCategories(category.cat_id);

        let budgetHtml = '';
        budgets.forEach(budget => {
            // const remaining_budget = budget.sub_remaining != null ? budget.sub_remaining : budget.sub_budget;

            budgetHtml += `
            <a href="/budget/logs/${budget.sub_id}"><div class="category__budgets__card">
                <p>${budget.sub_name}</p>
                <div>
                    <p><strong>Available</strong></p>
                    <p>${budget.sub_remaining != null ? budget.sub_remaining : budget.sub_budget}</p>
                </div>
                <div>
                    <p><strong>Budget</strong></p>
                    <p>${budget.sub_budget}</p>
                </div>
            </div></a>
            `
        })

        html += `
        <div class="category" style="background-color: ${category.cat_color}" data-id="${category.cat_id}" aria-expanded="true">
            <div class="category__card">
                <p class="category__name">${category.cat_name}</p>
            </div>
            <div class="category__settings">
                <img class="category-edit d-none" src="/images/pencil.png" alt="edit">
                <img class="category-delete d-none" src="/images/trash.png" alt="delete">
                <img class="category-settings" src="/images/settings.png" alt="settings">
            </div>
            <div class="category__budgets">
                ${budgetHtml}
                <img class="category__budgets__add" src="/images/add.png" alt="Add new sub category">
            </div>
        </div>
        `
    };

    return html;
}

function buildCategoryOptions(categories) {
    let html = '';
    categories.forEach(category => {
        html += `<option value="${category.cat_id}">${category.cat_name}</option>`;
    })

    return html;
}

function buildLogEntries(logs) {
    let html = '';
    logs.forEach(log => {
        const date = new Date(log.exp_date).toLocaleDateString();

        html += `
        <div class="log">
            <p>${log.account_firstname}</p>
            <div class="log__title">
                <p>${log.exp_for}</p>
                <p>${date}</p>
            </div>
            <p>${log.exp_cost}</p>
        </div>`
    })

    return html;
}

module.exports = { requireLogin, buildCategoryCards, buildCategoryOptions, buildLogEntries, checkAuthorization };