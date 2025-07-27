const budgetModel = require('../database/budgetModels');
const settingsModel = require('../database/settingsModels');
const utilities = require('../utilities/');
const templates = require('../utilities/templates');

async function buildDashboard(req, res) {
    const user = req.session.user;
    const totalBudget = await budgetModel.getTotalBudget(req.session.user.bg_id);

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
    res.render('budget/dashboard', {scripts, total: totalBudget, categoryCards });
}

function renderCreateCategory(req, res) {
    const endpoint = "create";
    const category = {cat_id: "", cat_name: ""};

    res.render('budget/category', {category, endpoint, edit: false, scripts: ''});
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
    const endpoint = "edit/" + cat_id;

    const category = await budgetModel.getCategory(cat_id);

    res.render('budget/category', {
        category,
        endpoint,
        edit: true,
        scripts: '<script src="/js/budget-category.js" defer></script>'
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

    const subCategory = await budgetModel.getSubCategoryBySlug(slug, req.session.user.bg_id);
    if (subCategory) {
        const sub_id = subCategory.sub_id;

        const resetDay = await settingsModel.getBudgetResetDay(req.session.user.bg_id);
        const dateRanges = utilities.getLogDateRange(resetDay);
        const logsData = await budgetModel.getLogs(sub_id, dateRanges);

        const logElements = utilities.buildLogEntries(logsData);

        res.render('budget/logs', { logElements, sub_id, scripts: '' })
    } else {
        next(new Error("Subcategory not found"));
    }
}
async function renderCreateSubCategory(req, res) {
    const cat_id = req.query.category;
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
    res.render('budget/subCategory', {cat_id, endpoint, categoryOptions, subcategory, edit, scripts});
}
async function createSubCategory(req, res) {
    const { cat_id, sub_name, sub_budget, is_savings } = req.body;

    const slug = utilities.generateUniqueSlug(sub_name, req.session.user.bg_id);

    const response = await budgetModel.addSubCategory(cat_id, sub_name, slug, sub_budget, (is_savings === 'true'));

    if (response) {
        res.redirect("/budget/");
    } else {
        next (new Error());
    }
    
}
async function renderEditSubCategory(req, res) {
    const sub_id = req.params.sub_id;
    const endpoint = "/edit/" + sub_id;

    const subCategory = await budgetModel.getSubCategory(sub_id);

    const categories = await budgetModel.getCategories(req.session.user.bg_id);
    const categoryOptions = templates.buildCategoryOptions(categories, subCategory.cat_id);

    if (subCategory) {
        res.render('budget/subCategory', { categoryOptions, subcategory: subCategory, endpoint, edit: true, scripts: '<script src="/js/budget-subCategory.js" defer></script>' });
    } else {
        next(new Error());
    }
}
async function editSubCategory(req, res) {
    const { sub_id, cat_id, sub_name, slug, sub_budget, is_savings } = req.body;

    const response = budgetModel.editSubCategory(sub_id, cat_id, sub_name, slug, sub_budget, is_savings == 'on' ? true : false);

    if (response) {
        res.redirect(`/budget/${sub_id}`);
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


// remove this in the future
async function updateSubCategory(req, res) {
    const { sub_id, sub_name, sub_budget } = req.body;

    const response = await budgetModel.editSubCategory(sub_id, sub_name, sub_budget);

    res.redirect(`/budget/logs/${sub_id}`);
}





async function buildLog(req, res) {
    const bg_id = req.session.user.bg_id;

    const categories = await budgetModel.getCategories(bg_id);

    const category_options = utilities.buildCategoryOptions(categories);

    res.render('budget/log', { category_options});
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

module.exports = { buildDashboard, buildLog, renderCreateCategory, createCategory, renderEditCategory, editCategory, deleteCategory, renderSubCategory, renderCreateSubCategory, createSubCategory, renderEditSubCategory, editSubCategory, deleteSubCategory, updateSubCategory, createLog, removeLog, editLog };
