const balanceDeleteForms = document.querySelectorAll('.balance-delete-form');
balanceDeleteForms.forEach((form) => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (confirm("Are you sure you want to delete this item?")) {
            form.submit();
        }
    })
})