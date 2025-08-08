const express = require('express');
const accountRoutes = require('./routes/accountRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const statsRoutes = require('./routes/statsRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const static = require('./routes/static');
const expressLayouts = require('express-ejs-layouts');
const baseController = require('./controllers/baseController');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require("express-session")
require("dotenv").config();
const pool = require("./database/connection");
const utilites = require("./utilities/");


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
app.use(methodOverride('X-HTTP-Method')) //          Microsoft
app.use(methodOverride('X-HTTP-Method-Override')) // Google/GData
app.use(methodOverride('X-Method-Override'))



// ------------------------------------
// Routes
// ------------------------------------
app.use(static);

app.get("/", utilites.requireLogin, (req, res, next) => {
    app.set('layout', 'layouts/layout');
    next();
}, baseController.buildHome);

app.use("/budget", utilites.requireLogin, (req, res, next) => {
    app.set('layout', 'layouts/budget_layout');
    next();
}, budgetRoutes);

app.use("/stats", utilites.requireLogin, (req, res, next) => {
    app.set('layout', 'layouts/budget_layout');
    next();
}, statsRoutes);

app.use("/account", (req, res, next) => {
    app.set('layout', 'layouts/layout');
    next();
}, accountRoutes);

app.use("/settings", utilites.requireLogin, (req, res, next) => {
    app.set('layout', 'layouts/budget_layout');
    next();
}, settingsRoutes);

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
})

// Catch all server errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    app.set('layout', 'layouts/layout');
    res.status(500);
    res.render('error');
});
