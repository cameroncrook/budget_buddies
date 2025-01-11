function buildIngredientCards(ingredients) {
    let html = '';

    ingredients.forEach((item) => {
        html += `
        <div class="ingredient-card">
            <p>${item.ingredient_name}</p>
        </div>
        `
    })
}