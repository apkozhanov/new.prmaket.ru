(function() {
  'use strict';

  // Создаем кнопку
  function createFloatingButton() {
    const button = document.createElement('button');
    button.className = 'floating-contact-btn';
    button.setAttribute('aria-label', 'Связаться с нами');
    
    // Создаем два изображения для переключения
    const icon1 = document.createElement('img');
    icon1.src = 'assets/images/Call logo1.svg';
    icon1.alt = 'Логотип';
    icon1.className = 'floating-contact-btn__icon';
    
    const icon2 = document.createElement('img');
    icon2.src = 'assets/images/Call logo2.svg';
    icon2.alt = 'Конверт';
    icon2.className = 'floating-contact-btn__icon';
    
    // Начинаем с иконки 2 (конверт)
    icon2.style.opacity = '1';
    icon1.style.opacity = '0';
    
    button.appendChild(icon1);
    button.appendChild(icon2);
    
    // Добавляем обработчик клика
    button.addEventListener('click', function() {
      const contactElement = document.getElementById('contact');
      if (contactElement) {
        contactElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
    
    // Добавляем кнопку в body
    document.body.appendChild(button);
    
    // Переключение иконок каждые 3 секунды
    let currentIcon = 2; // Начинаем с иконки 2 (конверт)
    
    setInterval(function() {
      if (currentIcon === 2) {
        // Переключаемся с иконки 2 на иконку 1
        icon2.style.transition = 'opacity 0.5s ease-in-out';
        icon1.style.transition = 'opacity 0.5s ease-in-out';
        icon2.style.opacity = '0';
        icon1.style.opacity = '1';
        currentIcon = 1;
      } else {
        // Переключаемся с иконки 1 на иконку 2
        icon1.style.transition = 'opacity 0.5s ease-in-out';
        icon2.style.transition = 'opacity 0.5s ease-in-out';
        icon1.style.opacity = '0';
        icon2.style.opacity = '1';
        currentIcon = 2;
      }
    }, 3000);
  }

  // Инициализируем при загрузке DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createFloatingButton);
  } else {
    createFloatingButton();
  }
})();

