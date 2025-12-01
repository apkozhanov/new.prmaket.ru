document.addEventListener('DOMContentLoaded', function() {
  const slider = document.querySelector('.slider');
  if (!slider) return;

  const track = slider.querySelector('.slider__track');
  const slides = slider.querySelectorAll('.slider__slide');
  const dots = slider.querySelectorAll('.slider__dot');
  const arrowLeft = slider.querySelector('.slider__arrow--left');
  const arrowRight = slider.querySelector('.slider__arrow--right');

  if (!track || slides.length === 0) return;

  let index = 0;

  function updateSlider() {
    // Обновляем точки на основе текущего индекса
    dots.forEach((dot, dotIndex) => {
      const icon = dot.querySelector('.slider__dot-icon');
      if (dotIndex === index) {
        if (icon) icon.src = 'assets/images/dot-active.svg';
        dot.classList.add('slider__dot--active');
      } else {
        if (icon) icon.src = 'assets/images/dot-inactive.svg';
        dot.classList.remove('slider__dot--active');
      }
    });

    // Обновляем видимость стрелок
    if (index === 0) {
      arrowLeft.style.opacity = '0';
      arrowLeft.style.pointerEvents = 'none';
    } else {
      arrowLeft.style.opacity = '1';
      arrowLeft.style.pointerEvents = 'auto';
    }

    if (index === slides.length - 1) {
      arrowRight.style.opacity = '0';
      arrowRight.style.pointerEvents = 'none';
    } else {
      arrowRight.style.opacity = '1';
      arrowRight.style.pointerEvents = 'auto';
    }
  }

  // Определение текущего индекса на основе скролла
  function updateIndexFromScroll() {
    const scrollLeft = track.scrollLeft;
    const slideWidth = track.clientWidth;
    const newIndex = Math.round(scrollLeft / slideWidth);
    
    if (newIndex !== index && newIndex >= 0 && newIndex < slides.length) {
      index = newIndex;
      updateSlider();
    }
  }

  // Переключение слайдов через scrollBy
  function goToSlide(newIndex) {
    index = Math.max(0, Math.min(newIndex, slides.length - 1));
    const slideWidth = track.clientWidth;
    track.scrollTo({
      left: index * slideWidth,
      behavior: 'smooth'
    });
    updateSlider();
  }

  // Обработчики стрелок
  arrowLeft.addEventListener('click', function() {
    if (index > 0) {
      track.scrollBy({
        left: -track.clientWidth,
        behavior: 'smooth'
      });
    }
  });

  arrowRight.addEventListener('click', function() {
    if (index < slides.length - 1) {
      track.scrollBy({
        left: track.clientWidth,
        behavior: 'smooth'
      });
    }
  });

  // Обработчики точек
  dots.forEach((dot, dotIndex) => {
    dot.addEventListener('click', function() {
      goToSlide(dotIndex);
    });
  });

  // Синхронизация индекса при скролле (нативный свайп)
  track.addEventListener('scroll', function() {
    updateIndexFromScroll();
  });

  // Инициализация
  updateIndexFromScroll();
  updateSlider();
});
