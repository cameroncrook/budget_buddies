const express = require('express');
const accountRoutes = require('./routes/accountRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const static = require('./routes/static');
const expressLayouts = require('express-ejs-layouts');
const accountController = require('./controllers/accountController');
const bodyParser = require('body-parser');
const session = require("express-session")
require("dotenv").config();
const pool = require("./database/connection");
const utilites = require("./utilities/");

// http://localhost:5500/account/register/f51052b13b83b403eede89ef59ef28ba51109151
// ------------------------------------
// app setup
// ------------------------------------
const app = express();
const port = 5500;

app.set('view engine', 'ejs');

// ------------------------------------
// Middleware
// ------------------------------------
app.use(session({
    store: new (require('connect-pg-simple')(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: 'session',
}));

app.use(expressLayouts);
app.set('layout', 'layouts/layout');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// ------------------------------------
// Routes
// ------------------------------------
app.use(static);

app.get("/", accountController.buildLogin);

app.use("/budget", utilites.requireLogin, (req, res, next) => {
    app.set('layout', 'layouts/budget_layout');
    next();
}, budgetRoutes);

app.use("/account", (req, res, next) => {
    app.set('layout', 'layouts/layout');
    next();
}, accountRoutes);

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
})
