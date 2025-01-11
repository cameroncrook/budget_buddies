const express = require('express');
const lifeController = require('../controllers/lifeController');
const router = new express.Router();

router.get('/', lifeController.buildMeals);

router.get('/meal/create', lifeController.buildMealCreate);
router.post('/meal/create', lifeController.handleMealCreate);

router.get('/meal/:meal_id', lifeController.buildMeal);
router.post('/meal', lifeController.handleMealUpdate);

router.get('/ingredients/:meal_id', lifeController.buildIngredients);
router.post('/ingredient', lifeController.handleAddIngredient);

router.get('/add', lifeController.buildMealAdd);

router.get('/shopping', lifeController.buildShopping);

router.get('/car', lifeController.buildCar);

module.exports = router;