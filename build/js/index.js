'use strict';
(()=> {
    const button = document.querySelector('.main-nav__btn');
    const navList = document.querySelector('.main-nav__list');
    const navItems = document.querySelectorAll('.main-nav__item');

    button.addEventListener('click', (evt) => {
        evt.preventDefault();
        if (!button.classList.contains('open')) {
            button.classList.add('open');
            navList.classList.add('open');
            navItems.forEach((navItem) => {
                navItem.classList.add('open');
            });

        } else {
            button.classList.remove('open');
            navList.classList.remove('open');
            navItems.forEach((navItem) => {
                navItem.classList.remove('open');
            });
        }

    })
})();
