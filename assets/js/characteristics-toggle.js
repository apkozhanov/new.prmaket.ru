/**
 * Логика переключения блока характеристик
 * Текстовая ссылка с подчеркивающей линией
 */

(function() {
  'use strict';

  // Ждем загрузки DOM
  document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.querySelector('.characteristics-toggle');
    const contentBlock = document.querySelector('.characteristics-content');
    const textSpan = toggleButton?.querySelector('.characteristics-toggle__text');
    const arrowSpan = toggleButton?.querySelector('.characteristics-toggle__arrow');

    if (!toggleButton || !contentBlock || !textSpan || !arrowSpan) {
      return;
    }

    // Начальное состояние - закрыто
    let isExpanded = false;
    let hasBeenClicked = false;

    // Функция обновления текста и состояния
    function updateToggleState() {
      if (isExpanded) {
        textSpan.textContent = 'Скрыть характеристики';
        arrowSpan.textContent = '▴';
        toggleButton.setAttribute('aria-expanded', 'true');
        contentBlock.classList.add('characteristics-content--expanded');
      } else {
        textSpan.textContent = 'Подробные характеристики';
        arrowSpan.textContent = '▾';
        toggleButton.setAttribute('aria-expanded', 'false');
        contentBlock.classList.remove('characteristics-content--expanded');
      }
    }

    // Обработчик клика
    toggleButton.addEventListener('click', function(e) {
      e.preventDefault();
      isExpanded = !isExpanded;
      hasBeenClicked = true;
      if (hasBeenClicked) {
        toggleButton.classList.add('characteristics-toggle--clicked');
      }
      updateToggleState();
    });

    // Инициализация начального состояния
    updateToggleState();
  });
})();


