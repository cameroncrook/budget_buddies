const express = require('express');
const lifeController = require('../controllers/lifeController');
const router = new express.Router();

router.get('/', lifeController.buildMeals);

router.get('/create', lifeController.buildMealCreate);

router.get('/add', lifeController.buildMealAdd);

router.get('/shopping', lifeController.buildShopping);

router.get('/car', lifeController.buildCar);

module.exports = router;