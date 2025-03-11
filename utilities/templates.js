function budgetAccountsTemplate(budgetAccounts) {
    let html = '';

    budgetAccounts.forEach((account) => {
        html += `
        <p class="settings__accounts--item">${account.account_firstname}</p>
        `
    })

    return html;
}

module.exports = { budgetAccountsTemplate }