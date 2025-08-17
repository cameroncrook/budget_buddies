const budgetModel = require("../database/budgetModels");

function requireLogin(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        return res.redirect("/account/login");
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
async function checkAuthorizationForCategory(req, res, next) {
    const cat_id = req.params.cat_id;
    const target_id = await budgetModel.getBudgetIdFromCategory(cat_id);
    const authorized_id = req.session.user.bg_id;

    if (target_id == authorized_id) {
        next();
    } else {
        return res.redirect("/budget/");
    }
}


// delete or move
function buildCategoryOptions(categories) {
    let html = '';
    categories.forEach(category => {
        html += `<option value="${category.cat_id}">${category.cat_name}</option>`;
    })

    return html;
}

function getLogDateRange(setDay, returnString=false) {
    let dateRanges = {};

    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();

    if (day < setDay) {
        dateRanges.start_month = String(month - 1).padStart(2, '0');
        dateRanges.end_month = String(month).padStart(2, '0');
    } else if (setDay == 1) {
        dateRanges.start_month = String(month).padStart(2, '0');
        dateRanges.end_month = String(month).padStart(2, '0');
    } else {
        dateRanges.start_month = String(month).padStart(2, '0');
        dateRanges.end_month = String(month + 1).padStart(2, '0');
    }

    dateRanges.start_year = year;

    if (dateRanges.end_month > 12) {
        dateRanges.end_month = '01';
        dateRanges.end_year = year + 1;
    } else {
        dateRanges.end_year = year;
    }

    dateRanges.start_day = String(setDay).padStart(2, '0');

    if (setDay == 1) {
        const nextMonth = new Date(year, month, 0);

        // Get the total days in the current month
        const totalDays = nextMonth.getDate();

        dateRanges.end_day = String(totalDays).padStart(2, '0');
    } else {
        dateRanges.end_day = String(setDay - 1).padStart(2, '0');
    }
    

    if (returnString) {
        const startDate = `${dateRanges.start_year}/${dateRanges.start_month}/${dateRanges.start_day}`;
        const endDate = `${dateRanges.end_year}/${dateRanges.end_month}/${dateRanges.end_day}`;

        return {startDate, endDate};
    } else {
        return dateRanges;
    }
}

function buildCategoriesObject(categories, sub_categories) {
    const subCatMap = {};
    sub_categories.forEach((sub_cat) => {
        if (!subCatMap[sub_cat.cat_id]) {
            subCatMap[sub_cat.cat_id] = []
        }

        subCatMap[sub_cat.cat_id].push(sub_cat);
    })

    
    const categoryObject = categories.map((category) => {
        let sub_category = [];
        if (subCatMap[category.cat_id.toString()]) {
            sub_category = subCatMap[category.cat_id.toString()];
        }

        return {
            cat_id: category.cat_id,
            cat_name: category.cat_name,
            cat_sub_budgets: sub_category
        }
    })

    return categoryObject;
}

async function generateUniqueSlug(name, bg_id, sub_id = null) {
  const baseSlug = name.toString().toLowerCase().trim().replace(/[\s\W-]+/g, '-').replace(/^-+|-+$/g, '');
  let slug = baseSlug;
  let count = 1;

  while (await budgetModel.slugExists(slug, bg_id, sub_id)) {
    slug = `${baseSlug}-${count++}`;
  }

  return slug;
};

function getChartData(labelColumn, valueColumn, data, limit) {
    let labels = [];
    let values = [];

    if (data.length < limit) {
        limit = data.length;
    }

    for (let i=0; i < limit; i++) {
        labels.push(data[i][labelColumn]);
        values.push(data[i][valueColumn]);
    }

    return {labels, values};
}


module.exports = { requireLogin, buildCategoryOptions, checkAuthorization, checkAuthorizationForCategory, getLogDateRange, buildCategoriesObject, generateUniqueSlug, getChartData};