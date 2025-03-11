const ingredientDelete = document.querySelectorAll('.meal_ingredient__delete');
ingredientDelete.forEach((item) => {
    item.addEventListener('click', handleIngredientDelete);
});

async function handleIngredientDelete(event) {
    const ingredient_element = event.target.parentNode;
    const meal_ingredient_id = ingredient_element.dataset.id;

    console.log(meal_ingredient_id);

    // const response = await fetch(`/life/ingredient/${meal_ingredient_id}`, { method: 'DELETE' })
    // if (response.ok) {
    //     location.reload();
    // } else {
    //     alert("Ingredient delete failed.");
    // }
}