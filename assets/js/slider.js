document.addEventListener('DOMContentLoaded', function() {
  const slider = document.querySelector('.slider');
  if (!slider) return;

  const track = slider.querySelector('.slider__track');
  const slides = slider.querySelectorAll('.slider__slide');
  const arrowLeft = slider.querySelector('.slider__arrow--left');
  const arrowRight = slider.querySelector('.slider__arrow--right');
  const dotsContainer = slider.querySelector('.slider__dots');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;

  // Создаем точки динамически на основе количества слайдов (только если контейнер пуст)
  if (dotsContainer && dotsContainer.children.length === 0) {
    slides.forEach((slide, index) => {
      const dot = document.createElement('button');
      dot.className = 'slider__dot';
      dot.setAttribute('data-index', index);
      dot.setAttribute('aria-label', `Перейти к слайду ${index + 1}`);
      
      const icon = document.createElement('img');
      icon.className = 'slider__dot-icon';
      icon.alt = '';
      
      if (index === 0) {
        icon.src = 'assets/images/dot-active.svg';
        dot.classList.add('slider__dot--active');
      } else {
        icon.src = 'assets/images/dot-inactive.svg';
      }
      
      dot.appendChild(icon);
      dotsContainer.appendChild(dot);
    });
  }

  const dots = slider.querySelectorAll('.slider__dot');

  // Обновление видимости стрелок и состояния точек
  function updateControls() {
    // Обновляем стрелки
    if (currentIndex === 0) {
      arrowLeft?.classList.add('slider__arrow--hidden');
    } else {
      arrowLeft?.classList.remove('slider__arrow--hidden');
    }

    if (currentIndex === slides.length - 1) {
      arrowRight?.classList.add('slider__arrow--hidden');
    } else {
      arrowRight?.classList.remove('slider__arrow--hidden');
    }

    // Обновляем точки
    dots.forEach((dot, index) => {
      const icon = dot.querySelector('.slider__dot-icon');
      if (index === currentIndex) {
        icon.src = 'assets/images/dot-active.svg';
        dot.classList.add('slider__dot--active');
      } else {
        icon.src = 'assets/images/dot-inactive.svg';
        dot.classList.remove('slider__dot--active');
      }
    });
  }

  // Определение текущего индекса на основе скролла
  function updateIndexFromScroll() {
    const scrollLeft = track.scrollLeft;
    const slideWidth = track.clientWidth;
    const newIndex = Math.round(scrollLeft / slideWidth);
    
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < slides.length) {
      currentIndex = newIndex;
      updateControls();
    }
  }

  // Переход к конкретному слайду
  function goToSlide(index) {
    if (index < 0 || index >= slides.length) return;
    
    const slideWidth = track.clientWidth;
    track.scrollTo({
      left: index * slideWidth,
      behavior: 'smooth'
    });
    
    // Обновляем индекс после начала скролла (будет синхронизирован через updateIndexFromScroll)
    // Но сразу обновляем UI для мгновенной реакции
    currentIndex = index;
    updateControls();
  }

  // Обработчики стрелок
  arrowLeft?.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  });

  arrowRight?.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (currentIndex < slides.length - 1) {
      goToSlide(currentIndex + 1);
    }
  });

  // Обработчики точек
  dots.forEach((dot, index) => {
    dot.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      goToSlide(index);
    });
  });

  // Синхронизация индекса при нативном скролле
  let scrollTimeout;
  track.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      updateIndexFromScroll();
    }, 50);
  });

  // Инициализация
  updateIndexFromScroll();
  updateControls();
});
