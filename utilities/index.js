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

// delete or move
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

function getLogDateRange(setDay) {
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
    

    return dateRanges;
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

const generateUniqueSlug = async (name) => {
  const baseSlug = name.toLowerCase().replace(/\s+/g, '-');
  let slug = baseSlug;
  let count = 1;

  while (await db.slugExists(slug)) {
    slug = `${baseSlug}-${count++}`;
  }

  return slug;
};


module.exports = { requireLogin, buildCategoryOptions, buildLogEntries, checkAuthorization, checkAuthorizationForCategory, getLogDateRange, buildCategoriesObject, generateUniqueSlug};