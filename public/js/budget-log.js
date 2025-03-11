const categorySelect = document.querySelector('#cat_id');

categorySelect.addEventListener('change', getSubCategories);

async function getSubCategories() {
    const cat_id = categorySelect.value;

    const response = await fetch(`/budget/get-sub-categories/${cat_id}`);
    const data = await response.json();
    console.log(data);

    let subCatOptions = '';
    data.forEach(subCategory => {
        subCatOptions += `<option value="${subCategory.sub_id}">${subCategory.sub_name} - ${subCategory.sub_remaining != null ? subCategory.sub_remaining : subCategory.sub_budget} remaining</option>`
    });

    document.querySelector('#sub_id').innerHTML = subCatOptions;

    return;
}

getSubCategories();

const currentDate = new Date();
let month = currentDate.getMonth() + 1;
let day = currentDate.getDate();
const year = currentDate.getFullYear();

month = (month < 10 ? '0' : '') + month;
day = (day < 10 ? '0' : '') + day;

const formattedDate = `${year}-${month}-${day}`;
document.getElementById("exp_date").value = formattedDate;