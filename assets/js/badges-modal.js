/**
 * Модальное окно справки по меткам проекта
 * Открывается при тапе по любому значку на карточке
 */
(function () {
  'use strict';

  var modal = document.getElementById('badges-modal');
  var overlay = document.querySelector('.badges-modal__overlay');
  var closeBtn = document.querySelector('.badges-modal__close');

  function openModal(activeBadges) {
    if (!modal) return;
    activeBadges = activeBadges || [];

    // Установить активные/неактивные иконки
    modal.querySelectorAll('.badges-modal__item').forEach(function (item) {
      var badge = item.getAttribute('data-badge');
      if (activeBadges.indexOf(badge) !== -1) {
        item.classList.remove('badges-modal__item--inactive');
      } else {
        item.classList.add('badges-modal__item--inactive');
      }
    });

    document.body.classList.add('badges-modal-open');
    modal.classList.add('badges-modal--open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    if (!modal) return;

    modal.classList.remove('badges-modal--open');
    document.body.classList.remove('badges-modal-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  function init() {
    if (!modal) return;

    // Клик по значку на карточке
    document.querySelectorAll('.similar-projects__tag').forEach(function (tag) {
      tag.style.cursor = 'pointer';
      tag.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var wrap = tag.closest('.similar-projects__image-wrap');
        var badgesStr = wrap ? wrap.getAttribute('data-badges') : '';
        var activeBadges = badgesStr ? badgesStr.split(',').map(function (s) { return s.trim(); }) : [];
        openModal(activeBadges);
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
      });
    }

    if (overlay) {
      overlay.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('badges-modal--open')) {
        closeModal();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
