const pool = require('./connection');

// CRUD OPERATIONS
// ================================================

// MEAL TABLE
// ======================================================

// Create a new meal
async function createMeal(mealName, bgId) {
    const query = `
        INSERT INTO public.meal (meal_name, bg_id)
        VALUES ($1, $2)
        RETURNING meal_id;
    `;
    const values = [mealName, bgId];

    try {
        const result = await pool.query(query, values);
        console.log('Meal created:', result.rows[0]);
        return result.rows[0].meal_id;
    } catch (err) {
        console.error('Error creating meal:', err);
        throw err;
    }
}
  
// Read all meals
async function readMeals() {
    const query = `
        SELECT * FROM public.meal;
    `;

    try {
        const result = await pool.query(query);
        console.log('Meals retrieved:', result.rows);
        return result.rows;
    } catch (err) {
        console.error('Error retrieving meals:', err);
        throw err;
    }
}
  
// Read a specific meal by ID
async function readMealById(mealId) {
    const query = `
        SELECT * FROM public.meal WHERE meal_id = $1;
    `;
    const values = [mealId];

    try {
        const result = await pool.query(query, values);
        console.log('Meal retrieved:', result.rows[0]);
        return result.rows[0];
    } catch (err) {
        console.error('Error retrieving meal:', err);
        throw err;
    }
}
  
  // Update a meal
async function updateMeal(mealId, mealName, mealLink, mealInstructions, bgId) {
    const query = `
        UPDATE public.meal
        SET meal_name = $1, meal_link = $2, meal_instructions = $3, bg_id = $4
        WHERE meal_id = $5
        RETURNING *;
    `;
    const values = [mealName, mealLink, mealInstructions, bgId, mealId];

    try {
        const result = await pool.query(query, values);
        console.log('Meal updated:', result.rows[0]);
        return result.rows[0];
    } catch (err) {
        console.error('Error updating meal:', err);
        throw err;
    }
}
  
// Delete a meal
async function deleteMeal(mealId) {
    const query = `
        DELETE FROM public.meal WHERE meal_id = $1 RETURNING *;
    `;
    const values = [mealId];

    try {
        const result = await pool.query(query, values);
        console.log('Meal deleted:', result.rows[0]);
        return result.rows[0];
    } catch (err) {
        console.error('Error deleting meal:', err);
        throw err;
    }
}





  
// INGREDIENT TABLE
// ======================================================

// Create a new ingredient
async function createIngredient(ingredientName) {
    const query = `
        INSERT INTO public.ingredient (ingredient_name)
        VALUES ($1)
        RETURNING ingredient_id;
    `;
    const values = [ingredientName];

    try {
        const result = await pool.query(query, values);
        console.log('Ingredient created:', result.rows[0]);
        return result.rows[0].ingredient_id;
    } catch (err) {
        console.error('Error creating ingredient:', err);
        throw err;
    }
}
  
// Read all ingredients
async function readIngredients() {
    const query = `
        SELECT * FROM public.ingredient;
    `;

    try {
        const result = await pool.query(query);
        console.log('Ingredients retrieved:', result.rows);
        return result.rows;
    } catch (err) {
        console.error('Error retrieving ingredients:', err);
        throw err;
    }
}
  
// Read a specific ingredient by ID
async function readIngredientById(ingredientId) {
    const query = `
        SELECT * FROM public.ingredient WHERE ingredient_id = $1;
    `;
    const values = [ingredientId];

    try {
        const result = await pool.query(query, values);
        console.log('Ingredient retrieved:', result.rows[0]);
        return result.rows[0];
    } catch (err) {
        console.error('Error retrieving ingredient:', err);
        throw err;
    }
}
  
// Update an ingredient
async function updateIngredient(ingredientId, ingredientName) {
    const query = `
        UPDATE public.ingredient
        SET ingredient_name = $1
        WHERE ingredient_id = $2
        RETURNING *;
    `;
    const values = [ingredientName, ingredientId];

    try {
        const result = await pool.query(query, values);
        console.log('Ingredient updated:', result.rows[0]);
        return result.rows[0];
    } catch (err) {
        console.error('Error updating ingredient:', err);
        throw err;
    }
}
  
// Delete an ingredient
async function deleteIngredient(ingredientId) {
    const query = `
        DELETE FROM public.ingredient WHERE ingredient_id = $1 RETURNING *;
    `;
    const values = [ingredientId];

    try {
        const result = await pool.query(query, values);
        console.log('Ingredient deleted:', result.rows[0]);
        return result.rows[0];
    } catch (err) {
        console.error('Error deleting ingredient:', err);
        throw err;
    }
}




// MEAL INGREDIENT TABLE
// ======================================================

// Create a new meal_ingredient
async function createMealIngredient(mealId, ingredientId, quantity) {
    const query = `
        INSERT INTO public.meal_ingredient (meal_id, ingredient_id, meal_ingredient_quantity)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const values = [mealId, ingredientId, quantity];

    try {
        const result = await pool.query(query, values);
        console.log('Meal Ingredient created:', result.rows[0]);
        return result.rows[0];
    } catch (err) {
        console.error('Error creating meal ingredient:', err);
        throw err;
    }
}

// Read all meal_ingredients
async function readMealIngredients() {
    const query = `
        SELECT * FROM public.meal_ingredient;
    `;

    try {
        const result = await pool.query(query);
        console.log('Meal Ingredients retrieved:', result.rows);
        return result.rows;
    } catch (err) {
        console.error('Error retrieving meal ingredients:', err);
        throw err;
    }
}

// Read a specific meal_ingredient by ID
async function readMealIngredientById(mealIngredientId) {
    const query = `
        SELECT * FROM public.meal_ingredient WHERE meal_ingredient_id = $1;
    `;
    const values = [mealIngredientId];

    try {
        const result = await pool.query(query, values);
        console.log('Meal Ingredient retrieved:', result.rows[0]);
        return result.rows[0];
    } catch (err) {
        console.error('Error retrieving meal ingredient:', err);
        throw err;
    }
}

// Update a meal_ingredient
async function updateMealIngredient(mealIngredientId, mealId, ingredientId, quantity) {
    const query = `
        UPDATE public.meal_ingredient
        SET meal_id = $1, ingredient_id = $2, meal_ingredient_quantity = $3
        WHERE meal_ingredient_id = $4
        RETURNING *;
    `;
    const values = [mealId, ingredientId, quantity, mealIngredientId];

    try {
        const result = await pool.query(query, values);
        console.log('Meal Ingredient updated:', result.rows[0]);
        return result.rows[0];
    } catch (err) {
        console.error('Error updating meal ingredient:', err);
        throw err;
    }
}

// Delete a meal_ingredient
async function deleteMealIngredient(mealIngredientId) {
    const query = `
        DELETE FROM public.meal_ingredient WHERE meal_ingredient_id = $1 RETURNING *;
    `;
    const values = [mealIngredientId];

    try {
        const result = await pool.query(query, values);
        console.log('Meal Ingredient deleted:', result.rows[0]);
        return result.rows[0];
    } catch (err) {
        console.error('Error deleting meal ingredient:', err);
        throw err;
    }
}

// PANTRY MEAL TABLE
// ======================================================

// Create a new pantry meal
async function createPantryMeal(pantryMealDate, mealId, bgId) {
    const query = `
        INSERT INTO public.pantry_meal (pantry_meal_date, meal_id, bg_id)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const values = [pantryMealDate, mealId, bgId];

    try {
        const result = await pool.query(query, values);
        console.log('Pantry Meal created:', result.rows[0]);
        return result.rows[0];
    } catch (err) {
        console.error('Error creating pantry meal:', err);
        throw err;
    }
}

// Read all pantry meals
async function readPantryMeals() {
    const query = `
        SELECT * FROM public.pantry_meal;
    `;

    try {
        const result = await pool.query(query);
        console.log('Pantry Meals retrieved:', result.rows);
        return result.rows;
    } catch (err) {
        console.error('Error retrieving pantry meals:', err);
        throw err;
    }
}

// Read a specific pantry meal by ID
async function readPantryMealById(pantryMealId) {
    const query = `
        SELECT * FROM public.pantry_meal WHERE pantry_meal_id = $1;
    `;
    const values = [pantryMealId];

    try {
        const result = await pool.query(query, values);
        console.log('Pantry Meal retrieved:', result.rows[0]);
        return result.rows[0];
    } catch (err) {
        console.error('Error retrieving pantry meal:', err);
        throw err;
    }
}

// Update a pantry meal
async function updatePantryMeal(pantryMealId, pantryMealDate, mealId, bgId) {
    const query = `
        UPDATE public.pantry_meal
        SET pantry_meal_date = $1, meal_id = $2, bg_id = $3
        WHERE pantry_meal_id = $4
        RETURNING *;
    `;
    const values = [pantryMealDate, mealId, bgId, pantryMealId];

    try {
        const result = await pool.query(query, values);
        console.log('Pantry Meal updated:', result.rows[0]);
        return result.rows[0];
    } catch (err) {
        console.error('Error updating pantry meal:', err);
        throw err;
    }
}

// Delete a pantry meal
async function deletePantryMeal(pantryMealId) {
    const query = `
        DELETE FROM public.pantry_meal WHERE pantry_meal_id = $1 RETURNING *;
    `;
    const values = [pantryMealId];

    try {
        const result = await pool.query(query, values);
        console.log('Pantry Meal deleted:', result.rows[0]);
        return result.rows[0];
    } catch (err) {
        console.error('Error deleting pantry meal:', err);
        throw err;
    }
}

// SHOPPING INGREDIENT TABLE
// ======================================================

// SHOPPING MANUAL TABLE
// ======================================================

module.exports = { createMeal, updateMeal, readMealById, createIngredient, readIngredients, createMealIngredient };