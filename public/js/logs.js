
const deleteForms = document.querySelectorAll('.log__delete-form');
deleteForms.forEach((form) => {
    form.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm("Are you sure you want to delete this item? This will remove all logs associated with it.")) {
            
            form.submit();
        }
    });
});