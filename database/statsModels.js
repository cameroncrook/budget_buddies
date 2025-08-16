const pool = require('./connection');

async function getBudgetTotals(bg_id, date_ranges) {
    try {
        const result = await pool.query(
            `SELECT
                (SELECT SUM(s.sub_budget)
                    FROM public.budget_category c
                    JOIN public.sub_category s ON s.cat_id = c.cat_id
                    WHERE c.bg_id = $1 AND s.is_savings IS NOT TRUE
                ) AS total_budget,
                (SELECT SUM(e.exp_cost)
                    FROM public.expenditure e
                    JOIN public.sub_category s ON s.sub_id = e.sub_id
                    JOIN public.budget_category c ON c.cat_id = s.cat_id
                    WHERE c.bg_id = $1 AND s.is_savings IS NOT TRUE
                    AND e.exp_date BETWEEN $2 AND $3
                ) AS total_expense;`, [bg_id, date_ranges.startDate, date_ranges.endDate]
        )

        return result.rows[0];
    } catch (error) {
        console.error('Error fetching budget totals:', error);
        return false;
    }
}

async function getCategoryTotals(bg_id, date_ranges) {
    try {
        const result = await pool.query(
            `SELECT 
                c.cat_id, 
                c.cat_name,
                (SELECT SUM(sub_budget) 
                FROM sub_category 
                WHERE cat_id = c.cat_id 
                AND is_savings IS NOT TRUE
                ) AS category_budget,
                SUM(e.exp_cost) AS category_expenses
            FROM budget_category c
            JOIN sub_category s 
            ON c.cat_id = s.cat_id
            AND s.is_savings IS NOT TRUE
            LEFT JOIN expenditure e 
            ON s.sub_id = e.sub_id
            AND e.exp_date BETWEEN $2 AND $3
            WHERE c.bg_id = $1
            GROUP BY c.cat_id, c.cat_name
            ORDER BY category_budget DESC;
            `, [bg_id, date_ranges.startDate, date_ranges.endDate]
        );

        return result.rows;
    } catch (error) {
        console.error('Error fetching category totals:', error);
        return false;
    }
}

module.exports = { getBudgetTotals, getCategoryTotals };