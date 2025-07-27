const pool = require('./connection');

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

module.exports = {
    getBudgetShareCode,
    getBudgetName,
    getBudgetResetDay,
    getBudgetAccounts,
    editBudgetResetDay
};