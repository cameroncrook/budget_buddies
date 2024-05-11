
// ---------------------------------------------------------
// loop through category cards
// ---------------------------------------------------------
const categoryCards = document.querySelectorAll('.category');
categoryCards.forEach(card => {
    card.querySelector('.category__card').addEventListener('click', function () {
        card.querySelector('.category__budgets').classList.toggle('d-none');

        const ariaExpanded = card.getAttribute('aria-expanded') == "true";

        card.setAttribute('aria-expanded', !ariaExpanded);
    })

    card.querySelector('.category__budgets__add').addEventListener('click', function () {
        const budgetForm = `
        <form class="create-budget-form" action="/budget/create-sub-category" method="post">
            <div class="form-input-field">
                <label for="sub_name">Name</label>
                <input type="text" id="sub_name" name="sub_name">
            </div>
            <div class="form-input-field">
                <label for="sub_budget">Budget</label>
                <input type="number" id="sub_budget" name="sub_budget" pattern="/^\d+(\.\d{1,2})?$/">
            </div>
            <div class="form-actions">
                <input class="form-cancel" type="button" value="CANCEL">
                <input type="submit" value="CREATE">
            </div>
            <input type="hidden" name="cat_id" value="${card.getAttribute('data-id')}">
        </form>
        `

        const popupContainer = document.createElement('div');
        popupContainer.innerHTML = budgetForm;
        popupContainer.className = "overlay overlay--lg";

        // cancel button
        popupContainer.querySelector('.form-cancel').addEventListener('click', function () {
            document.querySelector('body').removeChild(popupContainer);
        })

        document.querySelector('body').appendChild(popupContainer);
    })

    const id = card.getAttribute('data-id');

    // // card click
    // const cardElement = card.querySelector('.category__card');
    // cardElement.addEventListener('click', function () {
    //     const expandedValue = card.getAttribute('aria-expanded');
    //     const expanded = expandedValue === "true";

    //     if (expanded) {
    //         const budgetsDiv = card.querySelector('.category__budgets');

    //         if (budgetsDiv) {
    //             card.removeChild(budgetsDiv);
    //         }
            
    //    } else {

            // const budgetsDiv = document.createElement('div');
            // budgetsDiv.className = "category__budgets";
            // budgetsDiv.innerHTML = `
            // <img class="category__budgets__add" src="/images/add.png" alt="Add new sub category">
            // `

            // Move to a pop-up box
            // budgetsDiv.querySelector('.category__budgets__add').addEventListener('click', function () {
            //     const budgetForm = `
            //     <form class="create-budget-form" action="/budget/create-sub-category" method="post">
            //         <div class="form-input-field">
            //             <label for="sub_name">Name</label>
            //             <input type="text" id="sub_name" name="sub_name">
            //         </div>
            //         <div class="form-input-field">
            //             <label for="sub_budget">Budget</label>
            //             <input type="number" id="sub_budget" name="sub_budget" pattern="/^\d+(\.\d{1,2})?$/">
            //         </div>
            //         <div class="form-actions">
            //             <input class="form-cancel" type="button" value="CANCEL">
            //             <input type="submit" value="CREATE">
            //         </div>
            //         <input type="hidden" name="cat_id" value="${id}">
            //     </form>
            //     `

            //     const popupContainer = document.createElement('div');
            //     popupContainer.innerHTML = budgetForm;
            //     popupContainer.className = "overlay overlay--lg";

            //     // cancel button
            //     popupContainer.querySelector('.form-cancel').addEventListener('click', function () {
            //         document.querySelector('body').removeChild(popupContainer);
            //     })

            //     document.querySelector('body').appendChild(popupContainer);
            // })

    //         card.appendChild(budgetsDiv);
    //     }

    //     card.setAttribute('aria-expanded', !expanded);
    // })

    const settingsIcon = card.querySelector('.category-settings');
    const deleteIcon = card.querySelector('.category-delete');
    const editIcon = card.querySelector('.category-edit');

    // settings icon click
    settingsIcon.addEventListener('click', function () {
        deleteIcon.classList.toggle('d-none');
        editIcon.classList.toggle('d-none');
    })

    // delete icon click
    deleteIcon.addEventListener('click', async function () {
        await fetch('/budget/delete-category', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cat_id: id
            })
        })

        document.querySelector('.category-display').removeChild(card);
    })

    // edit icon click
    editIcon.addEventListener('click', function () {
        const cat_name = card.querySelector('.category__name').textContent;
        const cat_color = rgbToHex(card.style.backgroundColor);
        console.log(cat_color.toLocaleLowerCase());

        card.innerHTML = buildCategoryForm("/budget/edit-category", cat_name, cat_color.toLowerCase(), id);
    })
})

async function buildSubBudgets(budget_id) {
    const response = await fetch(`/budgets/get-sub-categories/${budget_id}`)

    const data = response.json();

    console.log(data);
}






// ---------------------------------------------------------
// Adding new category
// ---------------------------------------------------------
const addIcon = document.querySelector(".add-category__icon");

addIcon.addEventListener('click', function () {
    addIcon.classList.add('d-none');

    const category_add = document.createElement('div');
    category_add.classList = "category";
    category_add.style.backgroundColor = "#ffb6c1";

    category_add.innerHTML = buildCategoryForm();

    const colorSelect = category_add.querySelector('#cat_color');
    colorSelect.addEventListener('change', function () {
        category_add.style.backgroundColor = colorSelect.value;
    })

    const categoryDisplay = document.querySelector('.category-display');

    categoryDisplay.appendChild(category_add);
})





// ---------------------------------------------------------
// Utility functions
// ---------------------------------------------------------

function buildCategoryForm(action="/budget/create-category", cat_name=null, cat_color="#ffb6c1", cat_id=null) {
    return `
    <form class="category__form" method="post" action="${action}">
        <div>
            <label for="cat_name">Name</label>
            <input type="text" id="cat_name" name="cat_name" ${cat_name ? `value="${cat_name}"` : ''} required>
        </div>
        <div>
            <label for"cat_color">Color</label>
            <select id="cat_color" name="cat_color">
                <option value="#f08080" ${cat_color=="#f08080" ? 'selected' : ''}>Light Coral</option>
                <option value="#fafad2" ${cat_color=="#fafad2" ? 'selected' : ''}>Light Goldenrod Yellow</option>
                <option value="#90ee90" ${cat_color=="#90ee90" ? 'selected' : ''}>Light Green</option>
                <option value="#ffb6c1" ${cat_color=="#ffb6c1" ? 'selected' : ''}>Light Pink</option>
                <option value="#add8e6" ${cat_color=="#add8e6" ? 'selected' : ''}>Light Blue</option>
                <option value="#ffa07a" ${cat_color=="#ffa07a" ? 'selected' : ''}>Light Salmon</option>
                <option value="#20b2aa" ${cat_color=="#20b2aa" ? 'selected' : ''}>Light Sea Green</option>
                <option value="#e6e6fa" ${cat_color=="#e6e6fa" ? 'selected' : ''}>Lavender</option>
            </select>
        </div>
        <input type="hidden" name="cat_id" value="${cat_id}">
        <input type="submit" value="Create">
    </form>
    `
}

function rgbToHex(rgb) {
    // Split the RGB string to get the individual values
    const rgbArray = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

    // Convert the RGB values to hexadecimal
    const hex = "#" + 
        ("0" + parseInt(rgbArray[1], 10).toString(16)).slice(-2) + 
        ("0" + parseInt(rgbArray[2], 10).toString(16)).slice(-2) + 
        ("0" + parseInt(rgbArray[3], 10).toString(16)).slice(-2);

    return hex.toUpperCase(); // Convert to uppercase for consistency
}

