function budgetAccountsTemplate(budgetAccounts) {
    let html = '';

    budgetAccounts.forEach((account) => {
        html += `
        <p class="settings__accounts--item">${account.account_firstname}</p>
        `
    })

    return html;
}

function categoryCardTemplate(budget_category, subCategoriesHTML, color) {
    return `
    <div class="category bg--${color}">
        <div class="category__header">
            <h2>${budget_category.cat_name}</h2>
            <div class="ham-menu">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
        <div class="category__body hidden">
            <div class="category__content">
                <ul style="margin-bottom: 10px;">
                    <li></li>
                    <li>Available</li>
                    <li>Budget</li>
                </ul>
                
                ${subCategoriesHTML}
            </div>
            <div class="category__actions">
                <a href="/budget/category/edit/${budget_category.cat_id}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m22.698,15.704c.209.773.104,1.583-.295,2.277s-1.046,1.192-1.819,1.4c-.772.208-1.583.104-2.277-.295l-.449-.259c-.842.72-1.811,1.279-2.857,1.649v.522c0,1.654-1.346,3-3,3s-3-1.346-3-3v-.522c-1.047-.37-2.016-.93-2.857-1.649l-.45.259c-.693.398-1.503.503-2.276.295s-1.42-.706-1.819-1.401c-.399-.693-.504-1.503-.295-2.276.208-.773.706-1.42,1.401-1.819l.45-.259c-.102-.543-.153-1.088-.153-1.626s.052-1.083.153-1.626l-.451-.259c-.694-.399-1.192-1.046-1.4-1.819-.209-.773-.104-1.583.295-2.277s1.046-1.192,1.819-1.4c.771-.209,1.583-.104,2.277.295l.449.259c.842-.72,1.811-1.279,2.857-1.649v-.522c0-1.654,1.346-3,3-3,1.067,0,2.063.574,2.598,1.499.277.479.113,1.09-.364,1.366-.481.278-1.092.113-1.366-.364-.179-.31-.511-.501-.867-.501-.552,0-1,.448-1,1v1.262c0,.456-.309.854-.75.968-1.237.32-2.361.969-3.25,1.877-.319.326-.818.394-1.213.168l-1.091-.627c-.231-.133-.498-.169-.759-.099-.258.069-.474.235-.606.467-.134.232-.169.501-.099.759.069.258.235.474.467.606l1.094.629c.395.228.586.693.465,1.133-.171.621-.258,1.246-.258,1.857s.087,1.236.258,1.857c.121.439-.07.905-.465,1.133l-1.093.629c-.232.133-.398.349-.468.606-.07.258-.035.526.099.758.133.232.349.398.606.468.259.069.527.034.758-.099l1.092-.627c.393-.226.893-.16,1.213.168.889.908,2.013,1.557,3.25,1.877.441.113.75.512.75.968v1.262c0,.552.448,1,1,1s1-.448,1-1v-1.262c0-.456.309-.854.75-.968,1.237-.32,2.361-.969,3.25-1.877.319-.326.82-.393,1.213-.168l1.091.627c.232.134.499.169.759.099.258-.069.474-.235.606-.467.134-.232.169-.501.099-.759-.069-.258-.235-.474-.467-.606l-1.094-.629c-.395-.228-.586-.693-.465-1.133.171-.621.258-1.246.258-1.857,0-.553.447-1,1-1s1,.447,1,1c0,.538-.052,1.083-.153,1.626l.451.259c.694.399,1.192,1.046,1.4,1.819Zm.423-10.583l-7.414,7.414c-.944.944-2.2,1.465-3.535,1.465h-1.172c-.553,0-1-.447-1-1v-1.172c0-1.335.521-2.591,1.465-3.535L18.879.879c1.17-1.17,3.072-1.17,4.242,0s1.17,3.072,0,4.242Zm-3.724.896l-1.414-1.414-5.104,5.104c-.559.559-.879,1.332-.879,2.121v.172h.172c.789,0,1.562-.32,2.121-.879l5.104-5.104Zm2.31-3.724c-.391-.391-1.023-.391-1.414,0l-.896.896,1.414,1.414.896-.896c.39-.39.39-1.024,0-1.414Z"/></svg></a>
                <a href="/budget/sub-category/create?category=${budget_category.cat_id}"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="m12 0a12 12 0 1 0 12 12 12.013 12.013 0 0 0 -12-12zm0 22a10 10 0 1 1 10-10 10.011 10.011 0 0 1 -10 10zm5-10a1 1 0 0 1 -1 1h-3v3a1 1 0 0 1 -2 0v-3h-3a1 1 0 0 1 0-2h3v-3a1 1 0 0 1 2 0v3h3a1 1 0 0 1 1 1z"/></svg></a>
            </div>
        </div>
    </div>
    `
}

function subCategoryCardTemplate(sub_category) {
    // add savings indicator
    return `
    <ul>
        <li><a href="/budget/logs/${sub_category.sub_id}">${sub_category.sub_name}</a></li>
        <li>${sub_category.sub_remaining}</li>
        <li>${sub_category.sub_budget}</li>
    </ul>
    `
}

function buildCategoryOptions(categories, selectedCategory = null) {
    let html = '';
    categories.forEach(category => {
        html += `<option value="${category.cat_id}" ${parseInt(selectedCategory) == category.cat_id ? 'selected' : ''}>${category.cat_name}</option>`;
    })

    return html;
}

module.exports = { budgetAccountsTemplate, categoryCardTemplate, subCategoryCardTemplate, buildCategoryOptions };