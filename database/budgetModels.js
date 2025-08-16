const pool = require('./connection');

async function addCategory(cat_name, bg_id) {
    try {
        await pool.query(
            `INSERT INTO public.budget_category (cat_name, bg_id)
            VALUES ($1, $2)
            `, [cat_name, bg_id]
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




async function getSubCategoryBySlug(slug, bg_id) {
    try {
        const result = await pool.query(
            `SELECT s.* FROM public.sub_category s
            INNER JOIN public.budget_category c
            ON s.cat_id = c.cat_id
            WHERE s.slug = $1 AND c.bg_id = $2`, [slug, bg_id]
        )

        return result.rows[0];
    } catch (err) {
        console.log(`Error while getting sub category by slug: ${err}`);

        return false;
    }
}
async function addSubCategory(cat_id, sub_name, slug, sub_budget, is_savings) {
    try {
        const result = await pool.query(
            `INSERT INTO public.sub_category (cat_id, sub_name, slug, sub_budget, is_savings)
            VALUES ($1,$2,$3,$4,$5)
            RETURNING sub_id;`, [cat_id, sub_name, slug, sub_budget, is_savings]
        )

        return result.rows[0].sub_id; // Return the newly created sub_id
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

async function editSubCategory(sub_id, cat_id, sub_name, slug, sub_budget, is_savings) {
    try {

        const result = await pool.query(
            `UPDATE public.sub_category
            SET cat_id=$1, sub_name=$2, slug=$3, sub_budget=$4, is_savings=$5
            WHERE sub_id=$6`, [cat_id, sub_name, slug, sub_budget, is_savings, sub_id]
        );

        return true;
    } catch (err) {
        console.log(`Error while editing sub category: ${err}`);

        return false;
    }
}

async function getSubCategory(sub_id) {
    try {
        const result = await pool.query(
            `SELECT *
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
                s.slug,
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

async function slugExists(slug, bg_id, sub_id) {
    try {
        let result;
        if (sub_id) {
            result = await pool.query(
                `SELECT s.slug FROM public.sub_category s
                INNER JOIN budget_category b
                ON b.cat_id = s.cat_id
                WHERE s.slug=$1 AND s.sub_id!=$2 AND b.bg_id=$3;`, [slug, sub_id, bg_id]
            )
        } else {
            result = await pool.query(
                `SELECT s.slug FROM public.sub_category s
                INNER JOIN budget_category b
                ON b.cat_id = s.cat_id
                WHERE s.slug=$1 AND b.bg_id=$2;`, [slug, bg_id]
            )
        }

        // If the slug exists, then it returns true
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


async function getSubCategories(cat_id, dateRanges) {
    try {
        
        const result = await pool.query(
            `SELECT 
                s.sub_id,
                s.sub_name,
                s.sub_budget,
                s.is_savings,
                CASE
                    WHEN s.is_savings THEN sa.savings_total
                    ELSE s.sub_budget - (SELECT COALESCE(SUM(exp_cost), 0) FROM public.expenditure WHERE sub_id = s.sub_id AND exp_date BETWEEN '${dateRanges.start_year}/${dateRanges.start_month}/${dateRanges.start_day}' AND '${dateRanges.end_year}/${dateRanges.end_month}/${dateRanges.end_day}')
                END AS sub_remaining
            FROM public.sub_category s
            LEFT JOIN savings sa
            ON s.sub_id = sa.sub_id
            WHERE s.cat_id=$1;`, [cat_id]
        )

        return result.rows;
    } catch (err) {
        console.log(`Error while getting sub categories: ${err}`);

        return false;
    }

}

async function subCategoryIsSavings(sub_id) {
    try {
        const result = await pool.query(
            `SELECT is_savings FROM public.sub_category
            WHERE sub_id = $1;`, [sub_id]
        )

        return result.rows[0].is_savings;
    } catch (err) {
        console.log(`Error while getting is_savings: ${err}`);

        return false;
    }
}
async function getSavings(sub_id) {
    try {
        const result = await pool.query(
            `SELECT *
            FROM public.savings 
            WHERE sub_id=$1;`, [sub_id]
        )

        return result.rows[0];
    } catch (err) {
        console.log(`Error while getting savings: ${err}`);

        return false;
    }
}
async function addSavings(sub_id, savings_total) {
    try {
        const result = await pool.query(
            `INSERT INTO public.savings (sub_id, savings_total)
            VALUES ($1, $2)`, [sub_id, savings_total]
        )

        return true;
    } catch (err) {
        console.log(`Error while adding savings: ${err}`);

        return false;
    }
}
async function updateSavingsTotal(sub_id, savings_total) {
    let currentDate = new Date();
    currentDate = currentDate.toISOString().split('T')[0]; // Format date to YYYY-MM-DD

    try {
        const result = await pool.query(
            `UPDATE public.savings
            SET savings_total=$1, savings_last_update=$2
            WHERE sub_id=$3`, [savings_total, currentDate, sub_id]
        )

        return true;
    } catch (err) {
        console.log(`Error while updating savings total: ${err}`);

        return false;
    }
}
async function addToSavings(sub_id, addition) {
    let currentDate = new Date();
    currentDate = currentDate.toISOString().split('T')[0];

    try {
        const result = await pool.query(
            `UPDATE public.savings
            SET savings_total = ((SELECT savings_total FROM savings WHERE sub_id = $1) + $2), savings_last_update = $3
            WHERE sub_id = $1;`, [sub_id, addition, currentDate]
        )

        return true;
    } catch (err) {
        console.log(`Error while adding to savings: ${err}`);

        return false;
    }
}
async function reduceFromSavings(sub_id, amount) {
    let currentDate = new Date();
    currentDate = currentDate.toISOString().split('T')[0];

    try {
        const result = await pool.query(
            `UPDATE public.savings
            SET savings_total = ((SELECT savings_total FROM savings WHERE sub_id=$1) - $2), savings_last_update = $3
            WHERE sub_id = $1;`, [sub_id, amount, currentDate]
        )

        return true;
    } catch (err) {
        console.log(`Error while reducing from savings: ${err}`);

        return false;
    }
}
async function removeSavings(sub_id) {
    try {
        const result = await pool.query(
            `DELETE FROM public.savings
            WHERE sub_id=$1`, [sub_id]
        )

        return true;
    } catch (err) {
        console.log(`Error while removing savings: ${err}`);

        return false;
    }
}
async function getAllSavings() {
    try {
        const result = await pool.query(
            `SELECT 
                bp.bg_budget_reset,
                sc.sub_id,
                sc.sub_budget
            FROM budget_plan bp
            INNER JOIN budget_category bc ON bp.bg_id = bc.bg_id
            INNER JOIN sub_category sc ON bc.cat_id = sc.cat_id
            INNER JOIN savings s ON sc.sub_id = s.sub_id;
            `, []
        )

        return result.rows;
    } catch (err) {
        console.log(`Error while getting all savings: ${err}`);

        return false;
    }
}

async function getLogs(sub_id, dateRanges) {
    try {
        // TODO: If Start day is `1` then it just goes by month
        const result = await pool.query(
            `SELECT a.account_firstname, e.exp_id, e.exp_for, e.exp_cost, e.exp_description, e.exp_date 
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
async function getLogDatabyId(exp_id) {
    try {
        const result = await pool.query(
            `SELECT sub_id, exp_cost FROM public.expenditure
            WHERE exp_id=$1`, [exp_id]
        )

        return result.rows[0];
    } catch (err) {
        console.log(`Error while getting log by id: ${err}`);

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

async function addBalance(balance_amount, balance_date, bg_id) {
    try {
        const result = await pool.query(
            `INSERT INTO public.balance (balance_amount, balance_date, bg_id)
            VALUES ($1, $2, $3);`, [balance_amount, balance_date, bg_id]
        );

        return true;
    } catch (err) {
        console.log(`Error while inserting new balance: ${err}`);

        return false;
    }
}
async function deleteBalance(balance_id) {
    try {
        const result = await pool.query(
            `DELETE FROM public.balance
            WHERE balance_id=$1`, [balance_id]
        );

        return true;
    } catch (err) {
        console.log(`Error while deleting balance: ${err}`);

        return false;
    }
}
async function getBalances(bg_id) {
    try {
        const result = await pool.query(
            `SELECT balance_id, balance_amount, balance_date
            FROM public.balance
            WHERE bg_id=$1
            ORDER BY balance_date DESC;`, [bg_id]
        );

        return result.rows;
    } catch (err) {
        console.log(`Error while getting balance: ${err}`);

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

module.exports = { addCategory, getCategory, getCategories, deleteCategory, editCategory, getSubCategoryBySlug, addSubCategory, removeSubCategory, editSubCategory, getSubCategories, getAllSubCategories, getSavings, subCategoryIsSavings, addSavings, updateSavingsTotal, addToSavings, reduceFromSavings, removeSavings, getAllSavings, getLogs, getLogDatabyId, addLog, deleteLog, updateLog, getSubCategory, getBudgetIdFromSub, getBudgetIdFromCategory, getTotalBudget, slugExists, addBalance, deleteBalance, getBalances }