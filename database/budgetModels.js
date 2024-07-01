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

async function editCategory(cat_id, cat_name, cat_color) {
    try {
        await pool.query(
            `UPDATE public.budget_category
            SET cat_name=$1, cat_color=$2
            WHERE cat_id = $3
            `, [cat_name, cat_color, cat_id]
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
            `SELECT cat_id, cat_name, cat_color FROM public.budget_category
            WHERE bg_id = $1
            `, [bg_id]
        )

        return result.rows;
    } catch(err) {
        console.log(`Error while retriving categories: ${err}`);

        return null;
    }
}

async function addSubCategory(cat_id, sub_name, sub_budget) {
    try {
        const result = await pool.query(
            `INSERT INTO public.sub_category (cat_id, sub_name, sub_budget)
            VALUES ($1,$2,$3)`, [cat_id, sub_name, sub_budget]
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

async function getSubCategories(cat_id) {
    try {
        const result = await pool.query(
            `SELECT s.*, (sub_budget - (SELECT SUM(exp_cost) as total FROM public.expenditure WHERE sub_id = s.sub_id AND DATE_TRUNC('month', exp_date) = DATE_TRUNC('month', CURRENT_DATE))) AS sub_remaining
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

        return result.rows[0];
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

async function getLogs(sub_id) {
    try {
        const result = await pool.query(
            `SELECT a.account_firstname, e.exp_for, e.exp_cost, e.exp_description, e.exp_date 
            FROM expenditure e
                INNER JOIN account a
                ON a.account_id = e.account_id
            WHERE sub_id=$1
            AND DATE_TRUNC('month', e.exp_date) = DATE_TRUNC('month', CURRENT_DATE)
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

module.exports = { addCategory, getCategories, deleteCategory, editCategory, addSubCategory, removeSubCategory, editSubCategory, getSubCategories, getBudgetShareCode, getBudgetName, getLogs, addLog, deleteLog, updateLog, getSubCategory, getBudgetIdFromSub, getTotalBudget }