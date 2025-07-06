const pool = require('./connection');

async function addCategory(cat_name, cat_color, bg_id) {
    try {
        await pool.query(
            `INSERT INTO public.budget_category (cat_name, cat_color, bg_id)
            VALUES ($1, $2, $3)
            `, [cat_name, cat_color, bg_id]
        )

        return true;
    } catch(err) {
        console.log(`Error while adding category: ${err}`);
        return false;
    }
}
async function getCategory(cat_id) {
    try {
        const result = await pool.query(
            `SELECT cat_id, cat_name FROM public.budget_category
            WHERE cat_id = $1
            `, [cat_id]
        );

        return result.rows[0];
    } catch(err) {
        console.log(`Error while getting category: ${err}`);
        return false;
    }
}
async function deleteCategory(cat_id) {
    try {
        await pool.query(
            `DELETE FROM public.budget_category
            WHERE cat_id = $1
            `, [cat_id]
        )

        return true;
    } catch(err) {
        console.log(`Error while deleting category: ${err}`)
        return false;
    }
}

async function editCategory(cat_id, cat_name) {
    try {
        await pool.query(
            `UPDATE public.budget_category
            SET cat_name=$1
            WHERE cat_id = $2
            `, [cat_name, cat_id]
        )

        return true;
    } catch(err) {
        console.log(`Error while updating category: ${err}`)
        return false;
    }
}

async function getCategories(bg_id) {
    try {
        const result = await pool.query(
            `SELECT cat_id, cat_name FROM public.budget_category
            WHERE bg_id = $1
            `, [bg_id]
        )

        return result.rows;
    } catch(err) {
        console.log(`Error while retriving categories: ${err}`);

        return null;
    }
}





async function addSubCategory(cat_id, sub_name, slug, sub_budget, is_savings) {
    try {
        const result = await pool.query(
            `INSERT INTO public.sub_category (cat_id, sub_name, slug, sub_budget, is_savings)
            VALUES ($1,$2,$3,$4,$5)`, [cat_id, sub_name, slug, sub_budget, is_savings]
        )

        return true;
    } catch (err) {
        console.log(`Error while inserting new sub category: ${err}`);

        return false;
    }
}

async function removeSubCategory(sub_id) {
    try {
        const result = await pool.query(
            `DELETE FROM public.sub_category
            WHERE sub_id=$1`, [sub_id]
        )

        return true;
    } catch (err) {
        console.log(`Error while removing sub category: ${err}`);

        return false;
    }
}

async function editSubCategory(sub_id, sub_name, sub_budget) {
    try {
        const result = await pool.query(
            `UPDATE public.sub_category
            SET sub_name=$1, sub_budget=$2
            WHERE sub_id=$3`, [sub_name, sub_budget, sub_id]
        )

        return true;
    } catch (err) {
        console.log(`Error while editing sub category: ${err}`);

        return false;
    }
}

async function getSubCategory(sub_id) {
    try {
        const result = await pool.query(
            `SELECT sub_name, sub_budget
            FROM public.sub_category
            WHERE sub_id=$1`, [sub_id]
        )

        return result.rows[0];
    } catch (err) {
        console.log(`Error while getting sub category: ${err}`);

        return false;
    }
}

async function getAllSubCategories(bg_id, dateRanges) {
    try {
        const result = await pool.query(
            `SELECT 
                s.cat_id, 
                s.sub_id,
                s.sub_name,
                s.sub_budget,
                s.is_savings,
                CASE
                    WHEN s.is_savings THEN sa.savings_total
                    ELSE s.sub_budget - (SELECT COALESCE(SUM(exp_cost), 0) FROM public.expenditure WHERE sub_id = s.sub_id AND exp_date BETWEEN '${dateRanges.start_year}/${dateRanges.start_month}/${dateRanges.start_day}' AND '${dateRanges.end_year}/${dateRanges.end_month}/${dateRanges.end_day}')
                END AS sub_remaining
            FROM public.budget_category c
            INNER JOIN public.sub_category s
            ON s.cat_id = c.cat_id
            LEFT JOIN public.savings sa
            ON sa.sub_id = s.sub_id
            WHERE c.bg_id = $1
            ORDER BY s.cat_id;`, [bg_id]
        )

        return result.rows;
    } catch (err) {
        console.log(`Error while getting sub categories: ${err}`);

        return false;
    }
}

async function slugExists(slug, bg_id) {
    try {
        const result = await pool.query(
            `SELECT s.slug FROM public.sub_category s
            INNER JOIN budget_category b
            ON b.cat_id = s.cat_id
            WHERE s.slug=$1 AND b.bg_id=$2;`, [slug, bg_id]
        )

        console.log(result);
        if (result.rows.length > 0) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log(`Error while checking slug: ${err}`);

        return false;
    }
}

// No Longer in Use
async function getSubCategories(cat_id, dateRanges) {
    try {
        
        const result = await pool.query(
            `SELECT s.*, (sub_budget - (SELECT SUM(exp_cost) as total FROM public.expenditure WHERE sub_id = s.sub_id AND exp_date BETWEEN '${dateRanges.start_year}/${dateRanges.start_month}/${dateRanges.start_day}' AND '${dateRanges.end_year}/${dateRanges.end_month}/${dateRanges.end_day}')) AS sub_remaining
            FROM public.sub_category s
            WHERE cat_id=$1;`, [cat_id]
        )

        return result.rows;
    } catch (err) {
        console.log(`Error while getting sub categories: ${err}`);

        return false;
    }

}






async function getBudgetShareCode(bg_id) {
    try {
        const result = await pool.query(
            `SELECT bg_sharecode FROM public.budget_plan
            WHERE bg_id=$1`, [bg_id]
        )

        return result.rows[0].bg_sharecode;
    } catch (err) {
        console.log(`Error while getting share code: ${err}`);

        return false;
    }
}

async function getBudgetName(bg_id) {
    try {
        const result = await pool.query(
            `SELECT bg_name FROM public.budget_plan
            WHERE bg_id=$1`, [bg_id]
        )

        return result.rows[0].bg_name;
    } catch (err) {
        console.log(`Error while getting budget name: ${err}`);

        return false;
    }
}

async function getLogs(sub_id, dateRanges) {
    try {
        // TODO: If Start day is `1` then it just goes by month
        const result = await pool.query(
            `SELECT a.account_firstname, e.exp_for, e.exp_cost, e.exp_description, e.exp_date 
            FROM expenditure e
                INNER JOIN account a
                ON a.account_id = e.account_id
            WHERE sub_id=$1
            AND e.exp_date BETWEEN '${dateRanges.start_year}/${dateRanges.start_month}/${dateRanges.start_day}' AND '${dateRanges.end_year}/${dateRanges.end_month}/${dateRanges.end_day}'
            ORDER BY e.exp_date DESC;`, [sub_id]
        )

        return result.rows;
    } catch (err) {
        console.log(`Error while getting logs: ${err}`);

        return false;
    }
}

async function addLog(sub_id, exp_for, exp_description, exp_date, exp_cost, account_id) {
    try {
        const result = await pool.query(
            `INSERT INTO public.expenditure (sub_id, account_id, exp_for, exp_description, exp_date, exp_cost)
            VALUES ($1, $2, $3, $4, $5, $6)`, [sub_id, account_id, exp_for, exp_description, exp_date, exp_cost]
        )

        return true;
    } catch (err) {
        console.log(`Error while adding new log: ${err}`);

        return false;
    }
}

async function deleteLog(exp_id) {
    try {
        const result = await pool.query(
            `DELETE FROM public.expenditure
            WHERE exp_id=$1`, [exp_id]
        )

        return true;
    } catch (err) {
        console.log(`Error while deleting log: ${err}`);

        return false;
    }
}

async function updateLog(exp_id, sub_id, exp_for, exp_description, exp_date, exp_cost) {
    try {
        const result = await pool.query(
            `UPDATE public.expenditure
            SET sub_id=$1, exp_for=$2, exp_description=$3, exp_date=$4, exp_cost=$5
            WHERE exp_id=$6`, [sub_id, exp_for, exp_description, exp_date, exp_cost, exp_id]
        )

        return true;
    } catch (err) {
        console.log(`Error while updating log: ${err}`);

        return false;
    }
}

async function getBudgetIdFromSub(sub_id) {
    try {
        const result = await pool.query(
            `SELECT bp.bg_id FROM budget_plan bp
            INNER JOIN public.budget_category bc
            ON bc.bg_id = bp.bg_id
            INNER JOIN public.sub_category sc 
            ON sc.cat_id = bc.cat_id
            WHERE sc.sub_id = $1;`, [sub_id]
        )

        return result.rows[0];
    } catch (err) {
        console.log(`Error while getting budget_id: ${err}`);

        return false;
    }
}

async function getBudgetIdFromCategory(cat_id) {
    try {
        const result = await pool.query(
            `SELECT bg_id FROM public.budget_category
            WHERE cat_id = $1;`, [cat_id]
        )

        return result.rows[0].bg_id;
    } catch (err) {
        console.log(`Error while getting budget_id from category: ${err}`); 
        return false;
    }
}

async function getTotalBudget(bp_id) {
    try {
        const result = await pool.query(
            `SELECT SUM(sc.sub_budget) as total FROM public.budget_plan bp
            INNER JOIN public.budget_category bc
            ON bp.bg_id = bc.bg_id
            INNER JOIN public.sub_category sc
            ON bc.cat_id = sc.cat_id
            WHERE bp.bg_id = $1;`, [bp_id]
        )

        return result.rows[0].total;
    } catch (err) {
        console.log(`Error while getting total budget: ${err}`);

        return false;
    }
}

async function getBudgetResetDay(bg_id) {
    try {
        const result = await pool.query(
            `SELECT bg_budget_reset FROM public.budget_plan
            WHERE bg_id = $1;`, [bg_id]
        )

        return result.rows[0].bg_budget_reset;
    } catch (err) {
        console.log(`Error while getting reset day: ${err}`);

        return false;
    }
}

async function getBudgetAccounts(bg_id) {
    try {
        const result = await pool.query(
            `SELECT account_firstname FROM public.account
            WHERE bg_id = $1;`, [bg_id]
        )

        return result.rows;
    } catch (err) {
        console.log(`Error while getting accounts: ${err}`);

        return false;
    }
}

async function editBudgetResetDay(bg_budget_reset, bg_id) {
    try {
        const result = await pool.query(
            `UPDATE public.budget_plan
            SET bg_budget_reset = $1
            WHERE bg_id = $2;`, [bg_budget_reset, bg_id]
        )

        return true;
    } catch (err) {
        console.log(`Error while updated budget reset day: ${err}`);

        return false;
    }
}

module.exports = { addCategory, getCategory, getCategories, deleteCategory, editCategory, addSubCategory, removeSubCategory, editSubCategory, getSubCategories, getAllSubCategories, getBudgetShareCode, getBudgetName, getLogs, addLog, deleteLog, updateLog, getSubCategory, getBudgetIdFromSub, getBudgetIdFromCategory, getTotalBudget, getBudgetResetDay, getBudgetAccounts, editBudgetResetDay, slugExists }