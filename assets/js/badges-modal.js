/**
 * Модальное окно справки по меткам проекта
 * Открывается при тапе по любому значку на карточке
 */
(function () {
  'use strict';

  var modal = document.getElementById('badges-modal');
  var overlay = document.querySelector('.badges-modal__overlay');
  var closeBtn = document.querySelector('.badges-modal__close');

  function uniq(list) {
    var seen = Object.create(null);
    var out = [];
    (list || []).forEach(function (value) {
      if (!value || seen[value]) return;
      seen[value] = true;
      out.push(value);
    });
    return out;
  }

  function getBadgeIdFromTag(tag) {
    if (!tag || !tag.classList) return '';
    var badgeClass = Array.from(tag.classList).find(function (cls) {
      return cls.indexOf('similar-projects__tag--') === 0;
    });
    if (!badgeClass) return '';
    return badgeClass.replace('similar-projects__tag--', '').trim();
  }

  function getWrapBadges(wrap) {
    if (!wrap) return [];
    var badgesStr = wrap.getAttribute('data-badges') || '';
    var fromData = badgesStr.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    if (fromData.length > 0) return uniq(fromData);

    var fromTags = Array.from(wrap.querySelectorAll('.similar-projects__tag')).map(function (tag) {
      return getBadgeIdFromTag(tag);
    }).filter(Boolean);
    return uniq(fromTags);
  }

  function openModal(activeBadges) {
    if (!modal) return;
    activeBadges = uniq(activeBadges || []);

    // Показываем только те бейджи, которые есть на выбранной карточке.
    modal.querySelectorAll('.badges-modal__item').forEach(function (item) {
      var badge = item.getAttribute('data-badge');
      var isVisible = activeBadges.indexOf(badge) !== -1;
      item.hidden = !isVisible;
      item.setAttribute('aria-hidden', isVisible ? 'false' : 'true');
      item.style.display = isVisible ? '' : 'none';
      item.classList.remove('badges-modal__item--inactive');
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
        var activeBadges = getWrapBadges(wrap);
        if (activeBadges.length === 0) {
          var current = getBadgeIdFromTag(tag);
          if (current) activeBadges = [current];
        }
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
