const crypt = require('crypto');
const accountModel = require('../database/accountModels');
const bcrypt = require("bcryptjs");
const { title } = require('process');

function buildLogin(req, res) {
    res.render("account/login", { message: "", layout: 'layouts/layout' });
}

async function login(req, res) {
    const { account_username, account_password } = req.body;

    const user = await accountModel.getAccount(account_username);

    if (await bcrypt.compare(account_password, user.account_password)) {
        delete user.account_password;

        req.session.user = user;

        return res.redirect("/budget");
    } else {

        // return res.redirect("/account/login");
        res.render("account/login", {message: '<p class="bg--warning">Invalid username or password</p>'});
    }
}

async function logout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.redirect("/");
        } else {
            console.log("logout successful");
            return res.redirect("/");
        }
    });
}

function buildRegister(req, res) {
    const shareCode = req.params.shareCode;

    res.render("account/register", { 
        title: "Register",
        shareCode
    });
}

async function register(req, res) {
    const { account_firstname, account_username, account_password, bg_code } = req.body;

    let hashedpassword;
    try {
        hashedpassword = await bcrypt.hashSync(account_password, 10);
    } catch (err) {
        console.log(`Error while encrypting password: ${err}`);

        return res.redirect(`/account/register/${bg_code}`);
    }

    const result = await accountModel.addAccount(account_firstname, account_username, hashedpassword, bg_code);

    if (result) {
        return res.redirect('/budget/');
    } else {
        return res.redirect(`/account/register/${bg_code}`);
    }
}

function buildCreateBudget(req, res) {
    res.render('account/create', { title: "Create Budget" });
} 

async function createBudget(req, res) {
    const { bg_name } = req.body;
    const shareCode = crypt.randomBytes(20).toString('hex');

    const result = await accountModel.addBudget(bg_name, shareCode);

    if (result) {
        return res.redirect(`/account/register/${shareCode}`);
    } else {
        return res.redirect('/account/create-budget');
    }
}

async function editColorTheme(req, res) {
    const { account_color_mode } = req.body;
    const account_id = req.session.user.account_id;

    const result = await accountModel.editAccountColorMode(account_id, account_color_mode);

    if (result) {
        return res.redirect('/settings');
    } else {
        console.log("Failed to update color mode");
        return res.redirect('/settings');
    }
}

module.exports = { buildLogin, buildRegister, buildCreateBudget, createBudget, register, login, logout, editColorTheme };