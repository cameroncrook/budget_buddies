const categories = document.querySelectorAll('.category');
if (typeof categories != 'undefined' && categories.length > 0) {
    categories.forEach((category) => {
        const button = category.querySelector('.ham-menu');
        const content = category.querySelector('.category__body');

        button.addEventListener('click', () => {
            button.classList.toggle('active');

            if (content.classList.contains('hidden')) {
                // Show content
                content.classList.remove('hidden');
                
                // Start height transition
                const height = content.scrollHeight + 'px';
                content.style.height = '0px'; // reset to start transition
                requestAnimationFrame(() => {
                content.style.height = height;
                });

                // After transition, remove inline height
                content.addEventListener('transitionend', () => {
                content.style.height = 'auto';
                }, { once: true });
            } else {
                // Collapse content
                const height = content.scrollHeight + 'px';
                content.style.height = height;

                requestAnimationFrame(() => {
                content.style.height = '0px';
                });

                // After transition, hide content
                content.addEventListener('transitionend', () => {
                content.classList.add('hidden');
                }, { once: true });
            }
        });

    });
}

