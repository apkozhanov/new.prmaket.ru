(function() {
  'use strict';

  function initMobileMenu() {
    const menuButton = document.querySelector('.m-header__btn--menu');
    const mobileMenu = document.getElementById('m-menu');
    const body = document.body;

    if (!menuButton || !mobileMenu) {
      return;
    }

    // Переключение меню
    menuButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      mobileMenu.classList.toggle('m-menu--open');
      menuButton.classList.toggle('m-header__btn--active');
      body.classList.toggle('menu-open');
    });

    // Закрытие меню при клике вне его
    document.addEventListener('click', function(e) {
      if (mobileMenu.classList.contains('m-menu--open')) {
        if (!mobileMenu.contains(e.target) && !menuButton.contains(e.target)) {
          mobileMenu.classList.remove('m-menu--open');
          menuButton.classList.remove('m-header__btn--active');
          body.classList.remove('menu-open');
        }
      }
    });

    // Закрытие меню при клике на ссылку
    const menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        mobileMenu.classList.remove('m-menu--open');
        menuButton.classList.remove('m-header__btn--active');
        body.classList.remove('menu-open');
      });
    });
  }

  // Инициализация при загрузке DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
  } else {
    initMobileMenu();
  }
})();


