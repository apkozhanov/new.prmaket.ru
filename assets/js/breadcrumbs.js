/**
 * Умные хлебные крошки (Collapsed Breadcrumbs)
 * 
 * На мобильных устройствах показывает только первую и последнюю части цепочки,
 * средние элементы заменяются на "...". По клику раскрывает полную цепочку.
 * 
 * Все элементы остаются в DOM для SEO.
 */

(function() {
  'use strict';

  /**
   * Проверяет, является ли устройство мобильным
   */
  function isMobile() {
    return window.innerWidth <= 768;
  }

  /**
   * Находит все элементы хлебных крошек в параграфе
   */
  function getBreadcrumbItems(paragraph) {
    const items = [];
    const children = Array.from(paragraph.childNodes);
    
    let currentItem = null;
    
    children.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();
        
        if (tagName === 'a' || (tagName === 'span' && node.classList.contains('current'))) {
          currentItem = {
            element: node,
            type: tagName === 'a' ? 'link' : 'current',
            text: node.textContent.trim()
          };
          items.push(currentItem);
        } else if (tagName === 'span' && node.classList.contains('divider')) {
          if (currentItem) {
            currentItem.divider = node;
          }
        }
      } else if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.trim();
        if (text && currentItem) {
          // Текст между элементами (пробелы)
          currentItem.afterText = node;
        }
      }
    });
    
    return items;
  }

  /**
   * Инициализирует умные хлебные крошки для одного блока
   */
  function initSmartBreadcrumbs(breadcrumbsNav) {
    const paragraph = breadcrumbsNav.querySelector('p');
    if (!paragraph) return;

    const items = getBreadcrumbItems(paragraph);
    
    // Если элементов меньше 3, не нужно сворачивать
    if (items.length < 3) {
      return;
    }

    // Добавляем класс для управления состоянием
    breadcrumbsNav.classList.add('breadcrumbs-smart');
    
    // Создаем элемент "..." для замены средних частей
    const ellipsisElement = document.createElement('span');
    ellipsisElement.className = 'breadcrumbs-ellipsis';
    ellipsisElement.textContent = '  …  ';
    ellipsisElement.setAttribute('aria-hidden', 'true');
    
    // Определяем, какие элементы скрыть (все кроме первого и последнего)
    const firstItem = items[0];
    const lastItem = items[items.length - 1];
    const middleItems = items.slice(1, -1);
    
    // Добавляем классы для скрытия средних элементов
    middleItems.forEach(item => {
      item.element.classList.add('breadcrumbs-middle');
      if (item.divider) {
        item.divider.classList.add('breadcrumbs-middle');
      }
      if (item.afterText) {
        item.afterText.classList.add('breadcrumbs-middle');
      }
    });
    
    // Скрываем разделитель первого элемента в свернутом состоянии
    if (firstItem.divider) {
      firstItem.divider.classList.add('breadcrumbs-first-divider');
    }
    
    // Скрываем текстовые узлы (пробелы) вокруг скрытых элементов
    const allNodes = Array.from(paragraph.childNodes);
    allNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        if (!text.trim()) {
          // Это пробел - проверяем соседей
          const prev = node.previousSibling;
          const next = node.nextSibling;
          
          let hideSpace = false;
          
          // Если предыдущий элемент скрыт
          if (prev && prev.nodeType === Node.ELEMENT_NODE) {
            if (prev.classList && (prev.classList.contains('breadcrumbs-middle') || 
                prev.classList.contains('breadcrumbs-first-divider'))) {
              hideSpace = true;
            }
          }
          
          // Если следующий элемент скрыт
          if (next && next.nodeType === Node.ELEMENT_NODE) {
            if (next.classList && (next.classList.contains('breadcrumbs-middle') || 
                next.classList.contains('breadcrumbs-first-divider'))) {
              hideSpace = true;
            }
          }
          
          // Если пробел между скрытыми элементами, скрываем его
          if (hideSpace) {
            node.textContent = ''; // Удаляем пробел
          }
        }
      }
    });
    
    // Вставляем многоточие сразу после первого элемента (без разделителя)
    // Это заменит визуально разделитель и средние элементы
    firstItem.element.parentNode.insertBefore(ellipsisElement, firstItem.element.nextSibling);
    
    // Обработчик клика для раскрытия/сворачивания
    let isExpanded = false;
    
    function toggleBreadcrumbs() {
      isExpanded = !isExpanded;
      breadcrumbsNav.classList.toggle('breadcrumbs-expanded', isExpanded);
      
      // Обновляем aria-expanded для доступности
      breadcrumbsNav.setAttribute('aria-expanded', isExpanded);
    }
    
    // Добавляем обработчик клика на весь блок
    breadcrumbsNav.style.cursor = 'pointer';
    breadcrumbsNav.setAttribute('role', 'button');
    breadcrumbsNav.setAttribute('aria-expanded', 'false');
    breadcrumbsNav.setAttribute('aria-label', 'Раскрыть полную цепочку навигации');
    breadcrumbsNav.addEventListener('click', function(e) {
      // Не раскрываем, если клик по ссылке или внутри ссылки
      let target = e.target;
      while (target && target !== breadcrumbsNav) {
        if (target.tagName === 'A') {
          return; // Позволяем ссылке работать нормально
        }
        target = target.parentNode;
      }
      
      // Если клик не по ссылке, переключаем состояние
      e.preventDefault();
      e.stopPropagation();
      toggleBreadcrumbs();
    });
    
    // Инициализируем состояние на основе размера экрана
    function updateBreadcrumbsState() {
      if (isMobile()) {
        breadcrumbsNav.classList.add('breadcrumbs-collapsed');
        breadcrumbsNav.classList.remove('breadcrumbs-expanded');
        isExpanded = false;
        breadcrumbsNav.setAttribute('aria-expanded', 'false');
      } else {
        breadcrumbsNav.classList.remove('breadcrumbs-collapsed', 'breadcrumbs-expanded');
        isExpanded = false;
        breadcrumbsNav.setAttribute('aria-expanded', 'false');
      }
    }
    
    updateBreadcrumbsState();
    
    // Обновляем при изменении размера окна
    let resizeTimeout;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateBreadcrumbsState, 150);
    });
  }

  /**
   * Инициализация при загрузке DOM
   */
  function init() {
    const breadcrumbsNavs = document.querySelectorAll('#breadcrumbs');
    
    breadcrumbsNavs.forEach(breadcrumbsNav => {
      initSmartBreadcrumbs(breadcrumbsNav);
    });
  }

  // Инициализация после загрузки DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

