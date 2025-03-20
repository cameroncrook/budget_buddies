const submitBtn = document.getElementById('bg_budget_reset_btn');

document.getElementById('bg_budget_reset').addEventListener('change', () => {
    submitBtn.disabled = false;

    return;
})