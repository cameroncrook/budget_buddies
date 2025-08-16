const tabs = document.querySelectorAll('.tabs button');
tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        const item = tab.dataset.for;

        document.querySelector('.tabs__item.active').classList.remove('active');
        document.querySelector(`.tabs__items .tabs__item[data-item="${item}"]`).classList.add('active');
    });
});