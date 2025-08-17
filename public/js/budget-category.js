// This script handles the category edit views

const form = document.querySelector('form');
if (form) {
    document.querySelector('.standard-form__delete')?.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm("Are you sure you want to delete this category? This will remove all sub-cateogries and logs associated with it.")) {
            const actionSplit = form.action.split('/');
            const lastSegment = actionSplit.pop();
            form.action = '/budget/category/delete/' + lastSegment;
            
            form.submit();
        }
    });
}