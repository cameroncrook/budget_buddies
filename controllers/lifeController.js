const lifeModel = require('../database/lifeModels');

async function buildMeals(req, res) {
    res.render('life/food');
}


async function buildMealAdd(req, res) {
    res.render('life/mealAdd');
}


async function buildMealCreate(req, res) {
    res.render('life/mealCreate');
}
async function handleMealCreate(req, res) {
    const { meal_name } = req.body;

    const bg_id = req.session.user.bg_id;

    const meal_id = await lifeModel.createMeal(meal_name, bg_id);

    res.redirect(`/life/meal/${meal_id}`);
}

async function buildMeal(req, res) {
    const meal_id = req.params.meal_id;

    const mealData = await lifeModel.readMealById(meal_id);

    res.render('life/mealEdit', { mealData });
}
async function handleMealUpdate(req, res) {
    const { meal_id, meal_name, meal_link, meal_instructions } = req.body;
    const bg_id = req.session.user.bg_id;

    const response = await lifeModel.updateMeal(meal_id, meal_name, meal_link, meal_instructions, bg_id);

    res.redirect(`/life/meal/${meal_id}`);
}


async function buildIngredients(req, res) {
    const meal_id = req.params.meal_id;
    const ingredients = await lifeModel.readIngredients();

    res.render('life/ingredients', { meal_id, ingredients });
}
async function handleAddIngredient(req, res) {
    const { ingredient_name, meal_ingredient_quantity, meal_id } = req.body;

    const ingredient_id = await lifeModel.createIngredient(ingredient_name);

    const mealIngredientData = await lifeModel.createMealIngredient(meal_id, ingredient_id, meal_ingredient_quantity);

    res.redirect(`/life/ingredients/${meal_id}`);
}


async function buildShopping(req, res) {
    res.render('life/shopping');
}


async function buildCar(req, res) {
    res.render('life/car');
}

module.exports = { buildMeals, buildMealAdd, buildMealCreate, handleMealCreate, buildShopping, buildCar, buildIngredients, buildMeal, handleMealUpdate, handleAddIngredient };