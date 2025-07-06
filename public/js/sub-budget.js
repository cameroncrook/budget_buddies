
document.getElementById('is_savings').addEventListener('change', () => {
    const isSavings = document.getElementById('is_savings').checked;
    if (isSavings) {
        document.querySelector('[name="is_savings"]').value = "true";
    } else {
        document.querySelector('[name="is_savings"]').value = "false";
    }
});