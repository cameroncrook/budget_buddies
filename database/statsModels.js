const pool = require('./connection');

async function getBudgetData(bg_id) {
    try {
        const result = await pool.query(`
            SELECT cat_name, cat_color, SUM(sc.sub_budget) as "total"
            FROM public.budget_category bc
            INNER JOIN sub_category sc
                ON sc.cat_id = bc.cat_id
            WHERE bc.bg_id = $1
            GROUP BY bc.cat_id
            ORDER BY total DESC;
        `, [bg_id]);

        return result.rows;
    } catch (err) {
        console.log(`An error occured getting budget data: ${err}`);

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

module.exports = { getBudgetData, getTotalBudget };