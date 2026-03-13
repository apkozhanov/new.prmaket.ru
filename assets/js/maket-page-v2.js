document.addEventListener('DOMContentLoaded', function () {
  var section = document.querySelector('body.page--maket-v2 .similar-projects');
  if (!section) return;

  var link = section.querySelector('[data-show-more]');
  if (!link) return;

  link.addEventListener('click', function (event) {
    event.preventDefault();

    var hiddenCards = Array.from(section.querySelectorAll('.similar-projects__item.is-hidden-by-more'));
    hiddenCards.slice(0, 2).forEach(function (card) {
      card.classList.remove('is-hidden-by-more');
    });

    link.hidden = true;
  });
});
