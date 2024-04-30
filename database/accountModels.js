const pool = require('./connection');

async function addBudget(name, code) {
    try {
        const result = await pool.query(
            `
            INSERT INTO public.budget_plan (bg_name, bg_sharecode)
            VALUES ($1, $2);
            `,
            [name, code]
        )

        return true;
    } catch (error) {
        console.log(`Error while adding budget: ${error}`)
        return false;
    }
}

async function addAccount(account_firstname, account_username, account_password, bg_code) {
    try {
        const result = await pool.query(`INSERT INTO public.account (account_firstname, account_username, account_password, bg_id)
        VALUES ($1, $2, $3, (SELECT bg_id FROM public.budget_plan WHERE bg_sharecode = $4))`, [account_firstname, account_username, account_password, bg_code])

        return true;
    } catch (err) {
        console.log(`Error while adding account: ${err}`)
        return false;
    }
}

async function getAccount(account_username) {
    try {
        const result = await pool.query(`SELECT * FROM public.account WHERE account_username = $1`, [account_username])

        return result.rows[0];
    } catch (err) {
        console.log(`Error while retriving user: ${err}`);

        return null;
    }
}

module.exports = { addBudget, addAccount, getAccount };