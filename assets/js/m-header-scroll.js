(function() {
  const header = document.querySelector('.m-header');
  if (!header) return;

  let lastScroll = 0;
  const threshold = 10;
  const maxWidth = 1024; // активируем только на мобильных и планшетах

  window.addEventListener('scroll', () => {
    if (window.innerWidth > maxWidth) {
      header.classList.remove('hide');
      return;
    }

    const currentScroll = window.pageYOffset;

    if (Math.abs(currentScroll - lastScroll) <= threshold) return;

    if (currentScroll > lastScroll && currentScroll > 80) {
      header.classList.add('hide');
    } else {
      header.classList.remove('hide');
    }

    lastScroll = currentScroll;
  });
})();
