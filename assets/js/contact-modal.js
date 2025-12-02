(function() {
  'use strict';

  // Получаем элементы
  const modal = document.getElementById('contact-modal');
  const openButton = document.querySelector('.floating-contact-btn');
  const closeButton = document.querySelector('.contact-modal__close');
  const overlay = document.querySelector('.contact-modal__overlay');
  const form = document.getElementById('contact-form');
  const workingHoursElement = document.getElementById('working-hours');

  // Функция для определения timezone и форматирования времени работы
  function updateWorkingHours() {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const offset = new Date().getTimezoneOffset();
      const hours = Math.abs(Math.floor(offset / 60));
      const minutes = Math.abs(offset % 60);
      const sign = offset > 0 ? '-' : '+';
      
      // Форматируем offset (например, GMT+3)
      const offsetString = `GMT${sign}${hours}${minutes > 0 ? ':' + String(minutes).padStart(2, '0') : ''}`;
      
      // Можно использовать более точное определение
      // Для простоты используем базовое значение GMT+3
      workingHoursElement.textContent = '9:00–18:00 (GMT+3)';
    } catch (e) {
      // Fallback если не поддерживается
      workingHoursElement.textContent = '9:00–18:00 (GMT+3)';
    }
  }

  // Открытие модального окна
  function openModal() {
    if (!modal) return;
    
    modal.classList.add('contact-modal--open');
    document.body.classList.add('contact-modal-open');
    
    // Сохраняем позицию скролла
    const scrollY = window.scrollY;
    document.body.style.top = `-${scrollY}px`;
    
    // Предотвращаем скролл фона
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  }

  // Закрытие модального окна
  function closeModal() {
    if (!modal) return;
    
    modal.classList.remove('contact-modal--open');
    document.body.classList.remove('contact-modal-open');
    
    // Восстанавливаем позицию скролла
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  }

  // Обработка отправки формы
  function handleFormSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('contact-name').value;
    const phone = document.getElementById('contact-phone').value;
    
    // Здесь можно добавить отправку данных на сервер
    console.log('Форма отправлена:', { name, phone });
    
    // Можно показать сообщение об успехе
    alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
    
    // Очищаем форму
    form.reset();
    
    // Закрываем модальное окно
    closeModal();
  }

  // Инициализация
  function init() {
    if (!modal) return;
    
    // Обновляем время работы
    if (workingHoursElement) {
      updateWorkingHours();
    }
    
    // Обработчик открытия модального окна
    if (openButton) {
      openButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openModal();
      });
    }
    
    // Обработчик закрытия по кнопке
    if (closeButton) {
      closeButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
      });
    }
    
    // Обработчик закрытия по клику на overlay
    if (overlay) {
      overlay.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
      });
    }
    
    // Обработчик отправки формы
    if (form) {
      form.addEventListener('submit', handleFormSubmit);
    }
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('contact-modal--open')) {
        closeModal();
      }
    });
  }

  // Инициализация при загрузке DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

