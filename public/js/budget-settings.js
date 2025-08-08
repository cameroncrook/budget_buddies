// slider change handler
const sliderTrack = document.querySelector('.color-mode__slider');
document.querySelector('.color-mode__slider-track').addEventListener('click', () => {
    sliderTrack.classList.toggle('left');
    sliderTrack.classList.toggle('right');

    const body = document.querySelector('body');
    const colorModeInput = document.getElementById('account_color_mode');
    if (body.dataset.theme === 'light-blue') {
        body.dataset.theme = 'light-pink';
        document.querySelector('.site-logo').src = '/images/BudgetBuddies-pink.png';
        colorModeInput.value = 'light-pink';
    } else {
        body.dataset.theme = 'light-blue';
        document.querySelector('.site-logo').src = '/images/BudgetBuddies-blue.png';
        colorModeInput.value = 'light-blue';
    }

    const submitBtn = document.querySelector('.color-mode__submit');
    if (submitBtn.disabled) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }

    return;
})

// budget reset day change handler
const submitBtn = document.getElementById('bg_budget_reset_btn');

document.getElementById('bg_budget_reset').addEventListener('change', () => {
    submitBtn.disabled = false;

    return;
})