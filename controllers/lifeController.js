async function buildMeals(req, res) {
    res.render('life/food');
}


async function buildMealAdd(req, res) {
    res.render('life/mealAdd');
}


async function buildMealCreate(req, res) {
    res.render('life/mealCreate');
}


async function buildShopping(req, res) {
    res.render('life/shopping');
}


async function buildCar(req, res) {
    res.render('life/car');
}

module.exports = { buildMeals, buildMealAdd, buildMealCreate, buildShopping, buildCar };