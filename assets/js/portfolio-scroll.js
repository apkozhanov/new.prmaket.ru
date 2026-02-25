(function() {
  'use strict';

  function init() {
    var scrollButtons = Array.from(document.querySelectorAll('[data-scroll-target]'));
    if (scrollButtons.length === 0) return;

    scrollButtons.forEach(function(button) {
      button.addEventListener('click', function(event) {
        event.preventDefault();

        var targetId = button.getAttribute('data-scroll-target');
        if (!targetId) return;

        var target = document.getElementById(targetId);
        if (!target) return;

        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
