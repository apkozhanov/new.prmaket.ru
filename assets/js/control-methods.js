document.addEventListener('DOMContentLoaded', function() {
  const controlSection = document.querySelector('.control-methods-section');
  if (!controlSection) return;

  const chips = controlSection.querySelectorAll('.chip-tag');
  const contents = controlSection.querySelectorAll('.control-method-content');

  if (chips.length === 0 || contents.length === 0) return;

  // Обработчик клика на чип
  chips.forEach(function(chip) {
    chip.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();

      const controlType = chip.getAttribute('data-control');
      if (!controlType) return;

      // Убираем primary класс со всех чипов и добавляем secondary
      chips.forEach(function(c) {
        c.classList.remove('chip-tag--primary');
        c.classList.add('chip-tag--secondary');
      });

      // Убираем secondary и добавляем primary к выбранному чипу
      chip.classList.remove('chip-tag--secondary');
      chip.classList.add('chip-tag--primary');

      // Скрываем весь контент
      contents.forEach(function(content) {
        content.style.display = 'none';
      });

      // Показываем соответствующий контент
      const targetContent = controlSection.querySelector('[data-content="' + controlType + '"]');
      if (targetContent) {
        targetContent.style.display = 'block';
      }
    });
  });
});

