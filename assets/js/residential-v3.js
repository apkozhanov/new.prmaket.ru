document.addEventListener('DOMContentLoaded', function () {
  initLayoutMethods();
  initPortfolioShowMore();
});

function initLayoutMethods() {
  var section = document.querySelector('.layout-methods-section');
  if (!section) return;

  var chips = Array.from(section.querySelectorAll('[data-layout]'));
  var contents = Array.from(section.querySelectorAll('[data-layout-content]'));
  if (chips.length === 0 || contents.length === 0) return;

  chips.forEach(function (chip) {
    chip.addEventListener('click', function (event) {
      event.preventDefault();

      var key = chip.getAttribute('data-layout');
      if (!key) return;

      chips.forEach(function (item) {
        item.classList.remove('chip-tag--primary');
        item.classList.add('chip-tag--secondary');
      });

      chip.classList.remove('chip-tag--secondary');
      chip.classList.add('chip-tag--primary');

      contents.forEach(function (content) {
        var contentKey = content.getAttribute('data-layout-content');
        content.style.display = contentKey === key ? '' : 'none';
      });
    });
  });
}

function initPortfolioShowMore() {
  var section = document.querySelector('#portfolio-block.similar-projects');
  if (!section) return;

  var link = section.querySelector('[data-show-more]');
  var cards = Array.from(section.querySelectorAll('.similar-projects__item'));
  if (!link || cards.length === 0) return;

  var initialCount = 2;
  var revealCount = 2;
  var maxCards = 4;

  function getVisibleCards() {
    return cards.filter(function (card) {
      return card.style.display !== 'none';
    });
  }

  function applyCollapsedState() {
    var visibleCards = getVisibleCards();

    cards.forEach(function (card) {
      card.classList.remove('is-hidden-by-more');
      card.classList.remove('is-hidden-overflow');
    });

    visibleCards.forEach(function (card, index) {
      if (index >= maxCards) {
        card.classList.add('is-hidden-overflow');
      } else if (index >= initialCount) {
        card.classList.add('is-hidden-by-more');
      }
    });

    link.hidden = visibleCards.length <= initialCount;
  }

  link.addEventListener('click', function (event) {
    event.preventDefault();

    var hiddenCards = getVisibleCards().filter(function (card) {
      return card.classList.contains('is-hidden-by-more');
    });

    hiddenCards.slice(0, revealCount).forEach(function (card) {
      card.classList.remove('is-hidden-by-more');
    });

    link.hidden = true;
  });

  setTimeout(applyCollapsedState, 0);
  setTimeout(applyCollapsedState, 40);
}
