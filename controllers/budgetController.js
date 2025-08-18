const budgetModel = require('../database/budgetModels');
const settingsModel = require('../database/settingsModels');
const accountModel = require('../database/accountModels');
const utilities = require('../utilities/');
const templates = require('../utilities/templates');

async function buildDashboard(req, res) {
    const user = req.session.user;
    const colorMode = await accountModel.getAccountColorMode(user.account_id);

    const resetDay = await settingsModel.getBudgetResetDay(user.bg_id);
    const dateRanges = utilities.getLogDateRange(resetDay);

    const categories = await budgetModel.getCategories(user.bg_id);
    const sub_categories = await budgetModel.getAllSubCategories(user.bg_id, dateRanges);

    const categoryData = utilities.buildCategoriesObject(categories, sub_categories);

    const colorThemes = ['primary', 'accent1', 'accent2', 'accent3', 'accent4'];
    
    let COL_INDEX = 0;
    const categoryCards = categoryData.reduce((html, item, index) => {
        const subCategoryHtml = item.cat_sub_budgets.reduce((html, sub_budget) => html + templates.subCategoryCardTemplate(sub_budget), '');

        const color = colorThemes[COL_INDEX];
        if (COL_INDEX < colorThemes.length - 1) {
            COL_INDEX++;
        } else {
            COL_INDEX = 0;
        }
        
        return html + templates.categoryCardTemplate(item, subCategoryHtml, color);
    }, '');

    const scripts = '<script src="/js/budget.js" defer></script>';
    res.render('budget/dashboard', {scripts, categoryCards, styles: '<link rel="stylesheet" href="/css/dashboard.css">', colorMode });
}

async function renderCreateCategory(req, res) {
    const colorMode = await accountModel.getAccountColorMode(req.session.user.account_id);
    const endpoint = "create";
    const category = {cat_id: "", cat_name: ""};

    res.render('budget/category', {category, endpoint, edit: false, scripts: '', styles: '', colorMode});
}
async function createCategory(req, res, next) {
    const { cat_name } = req.body;

    const user = req.session.user;

    const response = await budgetModel.addCategory(cat_name, user.bg_id);

    if (response) {
        res.redirect("/budget/");
    } else {
        next(new Error());
    }
}
async function renderEditCategory(req, res) {
    const cat_id = req.params.cat_id;
    const colorMode = await accountModel.getAccountColorMode(req.session.user.account_id);

    const endpoint = "edit/" + cat_id;

    const category = await budgetModel.getCategory(cat_id);

    res.render('budget/category', {
        category,
        endpoint,
        edit: true,
        scripts: '<script src="/js/budget-category.js" defer></script>',
        styles: '',
        colorMode
    });
}
async function editCategory(req, res) {
    const { cat_id, cat_name } = req.body;

    const response = await budgetModel.editCategory(cat_id, cat_name);

    res.redirect("/budget/");
}
async function deleteCategory(req, res, next) {
    const cat_id = req.params.cat_id;

    const response = await budgetModel.deleteCategory(cat_id);
    if (response) {
        res.redirect("/budget/");
    } else {
        // Throw a 500 error
        next(new Error());
    }
}




async function renderSubCategory(req, res, next) {
    const slug = req.params.slug;
    const colorMode = await accountModel.getAccountColorMode(req.session.user.account_id);

    const subCategory = await budgetModel.getSubCategoryBySlug(slug, req.session.user.bg_id);
    if (subCategory) {
        const sub_id = subCategory.sub_id;

        const resetDay = await settingsModel.getBudgetResetDay(req.session.user.bg_id);
        const dateRanges = utilities.getLogDateRange(resetDay, true);
        const logsData = await budgetModel.getLogs(sub_id, dateRanges.startDate, dateRanges.endDate);

        const logElements = templates.buildLogEntries(logsData);

        res.render('budget/logs', { logElements, sub_id, slug, scripts: '<script src="/js/logs.js" defer></script>', styles: '<link rel="stylesheet" href="/css/logs.css">', colorMode })
    } else {
        next(new Error("Subcategory not found"));
    }
}
async function searchSubCategory(req, res) {
    const slug = req.params.slug;
    const { from, to } = req.body;
    const colorMode = await accountModel.getAccountColorMode(req.session.user.account_id);

    const subCategory = await budgetModel.getSubCategoryBySlug(slug, req.session.user.bg_id);
    if (subCategory) {
        const sub_id = subCategory.sub_id;

        const logsData = await budgetModel.getLogs(sub_id, from, to);
        const results = await budgetModel.getLogsTotal(sub_id, from, to);

        if (logsData) {
            const logElements = templates.buildLogEntries(logsData);

            res.render('budget/search', { logElements, results, slug, scripts: '<script src="/js/logs.js" defer></script>', styles: '<link rel="stylesheet" href="/css/logs.css">', colorMode })
        } else {
            next(new Error());
        }
        
    } else {
        next(new Error("Subcategory not found"));
    }
}
async function renderCreateSubCategory(req, res) {
    const cat_id = req.query.category;
    const colorMode = await accountModel.getAccountColorMode(req.session.user.account_id);
    const endpoint = "/create";

    const categories = await budgetModel.getCategories(req.session.user.bg_id);
    const categoryOptions = templates.buildCategoryOptions(categories, cat_id);

    const subcategory = {
        sub_name: "",
        sub_budget: "",
        slug: "",
        is_savings: false,
        sub_id: "",
    }

    const edit = false;

    const scripts = '<script src="/js/sub-budget.js" defer></script>';
    res.render('budget/subCategory', {cat_id, endpoint, categoryOptions, subcategory, edit, scripts, styles: '', colorMode});
}
async function createSubCategory(req, res, next) {
    const { cat_id, sub_name, sub_budget, is_savings } = req.body;

    const slug = await utilities.generateUniqueSlug(sub_name, req.session.user.bg_id);

    const isSavings = is_savings === 'true';

    const response = await budgetModel.addSubCategory(cat_id, sub_name, slug, sub_budget, (is_savings === 'true'));

    if (response) {
        if (isSavings) {
            await budgetModel.addSavings(response, sub_budget);
        };

        res.redirect("/budget/");
    } else {
        next (new Error());
    }
    
}
async function renderEditSubCategory(req, res) {
    const sub_id = req.params.sub_id;
    const colorMode = await accountModel.getAccountColorMode(req.session.user.account_id);
    const endpoint = "/edit/" + sub_id;

    const subCategory = await budgetModel.getSubCategory(sub_id);

    const categories = await budgetModel.getCategories(req.session.user.bg_id);
    const categoryOptions = templates.buildCategoryOptions(categories, subCategory.cat_id);

    if (subCategory) {
        res.render('budget/subCategory', { categoryOptions, subcategory: subCategory, endpoint, edit: true, scripts: '<script src="/js/budget-subCategory.js" defer></script>', styles: '', colorMode });
    } else {
        next(new Error());
    }
}
async function editSubCategory(req, res) {
    const { sub_id, cat_id, sub_name, sub_budget } = req.body;

    const newSlug = await utilities.generateUniqueSlug(sub_name, req.session.user.bg_id);
    const response = budgetModel.editSubCategory(sub_id, cat_id, sub_name, newSlug, sub_budget);

    if (response) {
        res.redirect(`/budget/${newSlug}`);
    } else {
        next(new Error());
    }
}
async function deleteSubCategory(req, res) {
    const sub_id = req.params.sub_id;

    const response = await budgetModel.removeSubCategory(sub_id);
    if (response) {
        res.redirect("/budget/");
    } else {
        // Throw a 500 error
        next(new Error());
    }
}
async function getSubCategories(req, res) {
    const cat_id = req.params.cat_id;
    const resetDay = await settingsModel.getBudgetResetDay(req.session.user.bg_id);
    const dateRanges = utilities.getLogDateRange(resetDay);

    const subCategories = await budgetModel.getSubCategories(cat_id, dateRanges);

    if (subCategories) {
        res.json(subCategories);
    } else {
        next(new Error());
    }
}


// remove this in the future
async function updateSubCategory(req, res) {
    const { sub_id, sub_name, sub_budget } = req.body;

    const response = await budgetModel.editSubCategory(sub_id, sub_name, sub_budget);

    res.redirect(`/budget/logs/${sub_id}`);
}





async function buildLog(req, res) {
    const bg_id = req.session.user.bg_id;
    const colorMode = await accountModel.getAccountColorMode(req.session.user.account_id);
    // const resetDay = await settingsModel.getBudgetResetDay(bg_id);
    // const dateRanges = utilities.getLogDateRange(resetDay);

    const categories = await budgetModel.getCategories(bg_id);
    // const sub_categories = await budgetModel.getAllSubCategories(bg_id, dateRanges);

    if (categories) {
        const category_options = utilities.buildCategoryOptions(categories);
        // const sub_category_options = templates.buildSubCategoryOptions(sub_categories);

        res.render('budget/log', { category_options, scripts: '<script src="/js/budget-log.js" defer></script><script src="/js/tabs.js" defer></script>', styles: '', colorMode} );
    } else {
        next(new Error());
    }
}

async function createLog(req, res, next) {
    const {sub_id, exp_for, exp_description, exp_date, exp_cost} = req.body;

    const account_id = req.session.user.account_id;

    const is_savings = await budgetModel.subCategoryIsSavings(sub_id);
    if (is_savings) {
        const savingsResponse = await budgetModel.reduceFromSavings(sub_id, parseFloat(exp_cost));

        if (!savingsResponse) {
            next(new Error());
        }
    }

    const response = await budgetModel.addLog(sub_id, exp_for, exp_description, exp_date, exp_cost, account_id);

    if (response) {
        res.redirect("/budget/log/add");
    } else {
        next(new Error());
    }
}

async function removeLog(req, res, next) {
    const log_id = req.params.log_id;

    const LogData = await budgetModel.getLogDatabyId(log_id);
    const isSavings = await budgetModel.subCategoryIsSavings(LogData.sub_id);
    if (isSavings) {
        const savingsResponse = await budgetModel.addToSavings(LogData.sub_id, LogData.exp_cost);
        if (!savingsResponse) {
            next(new Error());
        }
    }

    const response = await budgetModel.deleteLog(log_id);
    if (response) {
        res.redirect("/budget/");
    } else {
        // Throw a 500 error
        next(new Error());
    }
}

async function editLog(req, res) {

}

async function renderEditSavings(req, res) {
    const sub_id = req.params.sub_id;
    const colorMode = await accountModel.getAccountColorMode(req.session.user.account_id);

    const savings = await budgetModel.getSavings(sub_id);

    if (savings) {
        res.render('budget/editSavings', { savings, scripts: '', styles: '', colorMode });
    }
}
async function editSavings(req, res, next) {
    const { sub_id, savings_total } = req.body;

    const response = await budgetModel.updateSavingsTotal(sub_id, savings_total);

    if (response) {
        res.redirect(`/budget/savings/${sub_id}`);
    } else {
        next(new Error());
    }
}

async function createBalance(req, res, next) {
    const { balance_amount, balance_date } = req.body;
    const bg_id = req.session.user.bg_id;

    const response = await budgetModel.addBalance(balance_amount, balance_date, bg_id);

    if (response) {
        res.redirect('/budget/log/add');
    } else {
        next(new Error());
    }
}
async function removeBalance(req, res, next) {
    const balance_id = req.params.balance_id;

    const response = await budgetModel.deleteBalance(balance_id);

    if (response) {
        res.redirect('/budget');
    } else {
        next(new Error());
    }
}

module.exports = { buildDashboard, buildLog, renderCreateCategory, createCategory, renderEditCategory, editCategory, deleteCategory, renderSubCategory, searchSubCategory, renderCreateSubCategory, createSubCategory, renderEditSubCategory, editSubCategory, deleteSubCategory, updateSubCategory, getSubCategories, createLog, removeLog, editLog, renderEditSavings, editSavings, createBalance, removeBalance };
