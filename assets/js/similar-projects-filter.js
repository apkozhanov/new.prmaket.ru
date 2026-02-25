document.addEventListener('DOMContentLoaded', function () {
  var section = document.querySelector('.similar-projects');
  if (!section) return;

  var gallery = section.querySelector('.similar-projects__gallery');
  var cards = Array.from(section.querySelectorAll('.similar-projects__item'));
  var quickFiltersEl = section.querySelector('[data-quick-filters]');
  var activeFiltersEl = section.querySelector('[data-active-filters]');
  var sheetEl = section.querySelector('#similar-filters-sheet');
  var sheetContentEl = section.querySelector('[data-filters-content]');
  var openFiltersButton = section.querySelector('[data-open-filters]');
  var closeFilterButtons = section.querySelectorAll('[data-filters-close]');
  var resetSheetButton = section.querySelector('[data-filters-reset]');
  var applySheetButton = section.querySelector('[data-filters-apply]');
  var hiddenInput = section.querySelector('input[name="portfolio_filter"]');
  var emptyState = section.querySelector('.similar-projects__empty');
  var resetEmptyButton = section.querySelector('.similar-projects__reset');
  var showMoreButton = section.querySelector('.similar-projects__more');

  if (!gallery || cards.length === 0 || !quickFiltersEl || !sheetContentEl || !sheetEl) return;

  var filterConfig = [
    {
      id: 'type',
      label: 'Тип макета',
      kind: 'multi',
      quick: true,
      options: [
        { value: 'makety-zhk', label: 'Макеты ЖК' },
        { value: 'makety-domov', label: 'Макеты домов' },
        { value: 'arhitekturnye-makety', label: 'Архитектурные макеты' },
        { value: 'promyshlennye-makety', label: 'Промышленные макеты' }
      ]
    },
    {
      id: 'material',
      label: 'Материал макета',
      kind: 'multi',
      options: [
        { value: 'akril', label: 'Акрил' },
        { value: 'massiv-dereva', label: 'Массив дерева' }
      ]
    },
    { id: 'sizeX', label: 'Ширина макета, мм', kind: 'range', mode: 'number', unit: 'мм', step: 10 },
    { id: 'sizeY', label: 'Длина макета, мм', kind: 'range', mode: 'number', unit: 'мм', step: 10 },
    { id: 'scale', label: 'Масштаб', kind: 'range', mode: 'number', step: 1, formatter: function (v) { return '1:' + v; } },
    { id: 'termMonths', label: 'Срок изготовления макета', kind: 'range', mode: 'number', unit: 'мес.', step: 1 },
    {
      id: 'city',
      label: 'Город',
      kind: 'multi',
      options: [
        { value: 'spb', label: 'Санкт-Петербург' },
        { value: 'moskva', label: 'Москва' },
        { value: 'yaroslavl', label: 'Ярославль' }
      ]
    },
    {
      id: 'detail',
      label: 'Детализация',
      kind: 'multi',
      options: [
        { value: 'high', label: 'Высокая' },
        { value: 'medium', label: 'Средняя' },
        { value: 'low', label: 'Низкая' }
      ]
    },
    {
      id: 'lighting',
      label: 'Подсветка',
      kind: 'multi',
      options: [
        { value: 'inside', label: 'Внутри домов' },
        { value: 'lanterns', label: 'Фонари' },
        { value: 'facades', label: 'Фасады' }
      ]
    },
    {
      id: 'control',
      label: 'Управление',
      kind: 'multi',
      options: [
        { value: 'stand', label: 'На стенде' },
        { value: 'remote', label: 'Через пульт' },
        { value: 'tablet', label: 'Планшет' },
        { value: 'app', label: 'Через приложение' }
      ]
    },
    { id: 'madeAtMonth', label: 'Дата изготовления', kind: 'range', mode: 'month' }
  ];

  var categoryById = Object.create(null);
  filterConfig.forEach(function (category) {
    categoryById[category.id] = category;
  });

  function parseCardFilter(el) {
    var raw = el.getAttribute('data-filter');
    if (!raw) return null;
    try {
      var parsed = JSON.parse(raw);
      return {
        el: el,
        type: normalizeArray(parsed.type),
        material: normalizeArray(parsed.material),
        sizeX: numberOrNull(parsed.sizeX),
        sizeY: numberOrNull(parsed.sizeY),
        scale: numberOrNull(parsed.scale),
        termMonths: numberOrNull(parsed.termMonths),
        city: normalizeArray(parsed.city),
        detail: normalizeArray(parsed.detail),
        lighting: normalizeArray(parsed.lighting),
        control: normalizeArray(parsed.control),
        madeAtMonth: monthToIndex(parsed.madeAtMonth)
      };
    } catch (err) {
      return null;
    }
  }

  function normalizeArray(value) {
    if (!Array.isArray(value)) return [];
    return value.map(function (entry) {
      return String(entry).trim();
    }).filter(Boolean);
  }

  function numberOrNull(value) {
    var parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function monthToIndex(value) {
    if (!value || typeof value !== 'string') return null;
    var match = /^(\d{4})-(\d{2})$/.exec(value);
    if (!match) return null;
    var year = Number(match[1]);
    var month = Number(match[2]);
    if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) return null;
    return year * 12 + (month - 1);
  }

  function monthIndexToString(index) {
    if (!Number.isFinite(index)) return '';
    var year = Math.floor(index / 12);
    var month = (index % 12) + 1;
    return String(year) + '-' + String(month).padStart(2, '0');
  }

  var cardData = cards.map(parseCardFilter).filter(Boolean);
  if (cardData.length === 0) return;

  var state = {
    multi: {},
    range: {}
  };

  var rangeBounds = {};
  filterConfig.forEach(function (category) {
    if (category.kind === 'multi') {
      state.multi[category.id] = [];
      return;
    }

    var values = cardData.map(function (item) {
      return item[category.id];
    }).filter(function (v) {
      return Number.isFinite(v);
    });

    var min = values.length ? Math.min.apply(null, values) : 0;
    var max = values.length ? Math.max.apply(null, values) : 0;
    rangeBounds[category.id] = { min: min, max: max };
    state.range[category.id] = { min: min, max: max };
  });

  applyDefaultState();
  applyUrlState();
  clampState();

  var uiRefs = {
    quickButtons: {},
    modalButtons: {},
    rangeControls: {}
  };

  renderQuickFilters();
  renderModalFilters();
  bindSheetControls();
  applyFilter();

  function applyDefaultState() {
    var raw = section.getAttribute('data-default-state');
    if (!raw) return;
    try {
      var defaults = JSON.parse(raw);
      Object.keys(defaults).forEach(function (categoryId) {
        var category = categoryById[categoryId];
        if (!category || category.kind !== 'multi') return;
        var values = normalizeArray(defaults[categoryId]);
        var allowed = category.options.map(function (opt) { return opt.value; });
        state.multi[categoryId] = values.filter(function (v) {
          return allowed.indexOf(v) !== -1;
        });
      });
    } catch (err) {
      /* ignore invalid defaults */
    }
  }

  function applyUrlState() {
    var params = new URLSearchParams(window.location.search);
    filterConfig.forEach(function (category) {
      var raw = params.get(category.id);
      if (!raw) return;

      if (category.kind === 'multi') {
        var allowed = category.options.map(function (opt) { return opt.value; });
        state.multi[category.id] = raw.split(',').map(function (v) {
          return v.trim();
        }).filter(function (v) {
          return allowed.indexOf(v) !== -1;
        });
        return;
      }

      var parts = raw.split('..');
      if (parts.length !== 2) return;

      if (category.mode === 'month') {
        var minMonth = monthToIndex(parts[0]);
        var maxMonth = monthToIndex(parts[1]);
        if (Number.isFinite(minMonth) && Number.isFinite(maxMonth)) {
          state.range[category.id] = { min: minMonth, max: maxMonth };
        }
      } else {
        var minNumber = Number(parts[0]);
        var maxNumber = Number(parts[1]);
        if (Number.isFinite(minNumber) && Number.isFinite(maxNumber)) {
          state.range[category.id] = { min: minNumber, max: maxNumber };
        }
      }
    });
  }

  function clampState() {
    filterConfig.forEach(function (category) {
      if (category.kind === 'multi') return;
      var bounds = rangeBounds[category.id];
      var selected = state.range[category.id];
      if (!selected) return;
      selected.min = Math.max(bounds.min, Math.min(bounds.max, selected.min));
      selected.max = Math.max(bounds.min, Math.min(bounds.max, selected.max));
      if (selected.min > selected.max) {
        var swap = selected.min;
        selected.min = selected.max;
        selected.max = swap;
      }
    });
  }

  function renderQuickFilters() {
    var quickCategory = categoryById.type;
    if (!quickCategory) return;

    quickFiltersEl.innerHTML = '';
    quickCategory.options.forEach(function (option) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'filter-pill filter-pill--secondary';
      button.setAttribute('data-category', quickCategory.id);
      button.setAttribute('data-value', option.value);
      button.innerHTML = '<span class="filter-pill__label">' + option.label + '</span><span class="filter-pill__close" aria-hidden="true"></span>';
      button.addEventListener('click', function (event) {
        event.preventDefault();
        toggleMultiOption(quickCategory.id, option.value);
      });
      quickFiltersEl.appendChild(button);
      uiRefs.quickButtons[option.value] = button;
    });
  }

  function renderModalFilters() {
    sheetContentEl.innerHTML = '';

    filterConfig.forEach(function (category) {
      var details = document.createElement('details');
      details.className = 'filters-sheet__section';
      details.open = true;

      var summary = document.createElement('summary');
      summary.className = 'filters-sheet__summary';
      summary.textContent = category.label;
      details.appendChild(summary);

      if (category.kind === 'multi') {
        var optionsWrap = document.createElement('div');
        optionsWrap.className = 'filters-sheet__options';
        uiRefs.modalButtons[category.id] = {};

        category.options.forEach(function (option) {
          var button = document.createElement('button');
          button.type = 'button';
          button.className = 'filter-pill filter-pill--secondary';
          button.setAttribute('data-category', category.id);
          button.setAttribute('data-value', option.value);
          button.innerHTML = '<span class="filter-pill__label">' + option.label + '</span><span class="filter-pill__close" aria-hidden="true"></span>';
          button.addEventListener('click', function (event) {
            event.preventDefault();
            toggleMultiOption(category.id, option.value);
          });
          optionsWrap.appendChild(button);
          uiRefs.modalButtons[category.id][option.value] = button;
        });

        details.appendChild(optionsWrap);
      } else {
        details.appendChild(buildRangeControls(category));
      }

      sheetContentEl.appendChild(details);
    });
  }

  function buildRangeControls(category) {
    var bounds = rangeBounds[category.id];
    var controlsWrap = document.createElement('div');
    controlsWrap.className = 'filters-sheet__range';

    var slidersWrap = document.createElement('div');
    slidersWrap.className = 'filters-sheet__range-sliders';

    var trackBase = document.createElement('div');
    trackBase.className = 'filters-sheet__range-track';
    var trackFill = document.createElement('div');
    trackFill.className = 'filters-sheet__range-track-fill';
    slidersWrap.appendChild(trackBase);
    slidersWrap.appendChild(trackFill);

    var minSlider = document.createElement('input');
    minSlider.type = 'range';
    minSlider.className = 'filters-sheet__slider filters-sheet__slider--min';
    minSlider.min = String(bounds.min);
    minSlider.max = String(bounds.max);
    minSlider.step = String(category.step || 1);
    minSlider.value = String(state.range[category.id].min);

    var maxSlider = document.createElement('input');
    maxSlider.type = 'range';
    maxSlider.className = 'filters-sheet__slider filters-sheet__slider--max';
    maxSlider.min = String(bounds.min);
    maxSlider.max = String(bounds.max);
    maxSlider.step = String(category.step || 1);
    maxSlider.value = String(state.range[category.id].max);

    slidersWrap.appendChild(minSlider);
    slidersWrap.appendChild(maxSlider);
    controlsWrap.appendChild(slidersWrap);

    var inputsWrap = document.createElement('div');
    inputsWrap.className = 'filters-sheet__range-inputs';

    var minInput = document.createElement('input');
    var maxInput = document.createElement('input');
    minInput.className = 'filters-sheet__input';
    maxInput.className = 'filters-sheet__input';

    if (category.mode === 'month') {
      minInput.type = 'month';
      maxInput.type = 'month';
      minInput.min = monthIndexToString(bounds.min);
      minInput.max = monthIndexToString(bounds.max);
      maxInput.min = monthIndexToString(bounds.min);
      maxInput.max = monthIndexToString(bounds.max);
      minInput.value = monthIndexToString(state.range[category.id].min);
      maxInput.value = monthIndexToString(state.range[category.id].max);
    } else {
      minInput.type = 'number';
      maxInput.type = 'number';
      minInput.min = String(bounds.min);
      minInput.max = String(bounds.max);
      maxInput.min = String(bounds.min);
      maxInput.max = String(bounds.max);
      minInput.step = String(category.step || 1);
      maxInput.step = String(category.step || 1);
      minInput.value = String(state.range[category.id].min);
      maxInput.value = String(state.range[category.id].max);
    }

    inputsWrap.appendChild(minInput);
    inputsWrap.appendChild(maxInput);
    controlsWrap.appendChild(inputsWrap);

    uiRefs.rangeControls[category.id] = {
      minSlider: minSlider,
      maxSlider: maxSlider,
      minInput: minInput,
      maxInput: maxInput,
      slidersWrap: slidersWrap,
      trackFill: trackFill,
      activeSlider: 'max'
    };

    setActiveSlider(category.id, 'max');
    syncRangeTrack(category.id);
    bindSliderStartEvents(minSlider, category.id, 'min');
    bindSliderStartEvents(maxSlider, category.id, 'max');

    minSlider.addEventListener('input', function () {
      updateRangeFromSliders(category.id, 'min');
    });
    maxSlider.addEventListener('input', function () {
      updateRangeFromSliders(category.id, 'max');
    });
    minInput.addEventListener('change', function () {
      updateRangeFromInputs(category.id);
    });
    maxInput.addEventListener('change', function () {
      updateRangeFromInputs(category.id);
    });

    return controlsWrap;
  }

  function bindSliderStartEvents(slider, categoryId, source) {
    var onStart = function (event) {
      handleSliderStart(categoryId, source, event);
    };

    if (window.PointerEvent) {
      slider.addEventListener('pointerdown', onStart);
    } else {
      slider.addEventListener('mousedown', onStart);
      slider.addEventListener('touchstart', onStart, { passive: false });
    }

    slider.addEventListener('focus', function () {
      setActiveSlider(categoryId, source);
    });
  }

  function handleSliderStart(categoryId, source) {
    setActiveSlider(categoryId, source);
  }

  function setActiveSlider(categoryId, source) {
    var controls = uiRefs.rangeControls[categoryId];
    if (!controls) return;

    controls.activeSlider = source;
    controls.minSlider.classList.toggle('filters-sheet__slider--active', source === 'min');
    controls.maxSlider.classList.toggle('filters-sheet__slider--active', source === 'max');

    controls.minSlider.style.zIndex = source === 'min' ? '5' : '4';
    controls.maxSlider.style.zIndex = source === 'max' ? '5' : '4';
  }

  function bindSheetControls() {
    if (openFiltersButton) {
      openFiltersButton.addEventListener('click', function (event) {
        event.preventDefault();
        openSheet();
      });
    }

    closeFilterButtons.forEach(function (btn) {
      btn.addEventListener('click', function (event) {
        event.preventDefault();
        closeSheet();
      });
    });

    if (resetSheetButton) {
      resetSheetButton.addEventListener('click', function (event) {
        event.preventDefault();
        clearAllFilters();
      });
    }

    if (resetEmptyButton) {
      resetEmptyButton.addEventListener('click', function (event) {
        event.preventDefault();
        clearAllFilters();
      });
    }

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && sheetEl.classList.contains('filters-sheet--open')) {
        closeSheet();
      }
    });
  }

  function openSheet() {
    sheetEl.classList.add('filters-sheet--open');
    sheetEl.setAttribute('aria-hidden', 'false');
    document.body.classList.add('filters-sheet-open');
  }

  function closeSheet() {
    sheetEl.classList.remove('filters-sheet--open');
    sheetEl.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('filters-sheet-open');
  }

  function toggleMultiOption(categoryId, value) {
    var selected = state.multi[categoryId] || [];
    var index = selected.indexOf(value);
    if (index === -1) {
      selected.push(value);
    } else {
      selected.splice(index, 1);
    }
    state.multi[categoryId] = selected;
    applyFilter();
  }

  function clearAllFilters() {
    filterConfig.forEach(function (category) {
      if (category.kind === 'multi') {
        state.multi[category.id] = [];
      } else {
        state.range[category.id] = {
          min: rangeBounds[category.id].min,
          max: rangeBounds[category.id].max
        };
      }
    });
    applyFilter();
  }

  function updateRangeFromSliders(categoryId, source) {
    var controls = uiRefs.rangeControls[categoryId];
    if (!controls) return;

    var min = Number(controls.minSlider.value);
    var max = Number(controls.maxSlider.value);
    if (min > max) {
      if (source === 'min') {
        max = min;
        controls.maxSlider.value = String(max);
      } else {
        min = max;
        controls.minSlider.value = String(min);
      }
    }

    setActiveSlider(categoryId, source);
    state.range[categoryId] = { min: min, max: max };
    syncRangeControls(categoryId);
    applyFilter();
  }

  function updateRangeFromInputs(categoryId) {
    var category = categoryById[categoryId];
    var controls = uiRefs.rangeControls[categoryId];
    var bounds = rangeBounds[categoryId];
    if (!controls || !category || !bounds) return;

    var min;
    var max;

    if (category.mode === 'month') {
      min = monthToIndex(controls.minInput.value);
      max = monthToIndex(controls.maxInput.value);
    } else {
      min = Number(controls.minInput.value);
      max = Number(controls.maxInput.value);
    }

    if (!Number.isFinite(min)) min = bounds.min;
    if (!Number.isFinite(max)) max = bounds.max;

    min = Math.max(bounds.min, Math.min(bounds.max, min));
    max = Math.max(bounds.min, Math.min(bounds.max, max));
    if (min > max) {
      var temp = min;
      min = max;
      max = temp;
    }

    if (document.activeElement === controls.minInput) {
      setActiveSlider(categoryId, 'min');
    } else if (document.activeElement === controls.maxInput) {
      setActiveSlider(categoryId, 'max');
    }

    state.range[categoryId] = { min: min, max: max };
    syncRangeControls(categoryId);
    applyFilter();
  }

  function syncRangeControls(categoryId) {
    var category = categoryById[categoryId];
    var controls = uiRefs.rangeControls[categoryId];
    var selected = state.range[categoryId];
    if (!controls || !selected || !category) return;

    controls.minSlider.value = String(selected.min);
    controls.maxSlider.value = String(selected.max);

    if (category.mode === 'month') {
      controls.minInput.value = monthIndexToString(selected.min);
      controls.maxInput.value = monthIndexToString(selected.max);
    } else {
      controls.minInput.value = String(selected.min);
      controls.maxInput.value = String(selected.max);
    }

    syncRangeTrack(categoryId);
  }

  function syncRangeTrack(categoryId) {
    var controls = uiRefs.rangeControls[categoryId];
    var selected = state.range[categoryId];
    var bounds = rangeBounds[categoryId];
    if (!controls || !selected || !bounds || !controls.trackFill) return;

    var span = bounds.max - bounds.min;
    var safeSpan = span === 0 ? 1 : span;

    var start = ((selected.min - bounds.min) / safeSpan) * 100;
    var end = ((selected.max - bounds.min) / safeSpan) * 100;

    start = Math.max(0, Math.min(100, start));
    end = Math.max(0, Math.min(100, end));
    if (end < start) {
      var tmp = start;
      start = end;
      end = tmp;
    }

    controls.trackFill.style.left = start + '%';
    controls.trackFill.style.width = (end - start) + '%';
  }

  function itemMatches(item, customState) {
    return filterConfig.every(function (category) {
      if (category.kind === 'multi') {
        var selectedValues = customState.multi[category.id] || [];
        if (selectedValues.length === 0) return true;
        var itemValues = item[category.id] || [];
        return selectedValues.some(function (value) {
          return itemValues.indexOf(value) !== -1;
        });
      }

      var selectedRange = customState.range[category.id];
      if (!selectedRange) return true;
      var itemValue = item[category.id];
      if (!Number.isFinite(itemValue)) return false;
      return itemValue >= selectedRange.min && itemValue <= selectedRange.max;
    });
  }

  function cloneState() {
    var cloned = { multi: {}, range: {} };
    Object.keys(state.multi).forEach(function (key) {
      cloned.multi[key] = state.multi[key].slice();
    });
    Object.keys(state.range).forEach(function (key) {
      cloned.range[key] = { min: state.range[key].min, max: state.range[key].max };
    });
    return cloned;
  }

  function isOptionDisabled(categoryId, optionValue) {
    var testState = cloneState();
    testState.multi[categoryId] = [optionValue];
    return !cardData.some(function (item) {
      return itemMatches(item, testState);
    });
  }

  function updatePillState(button, isActive, isDisabled) {
    button.classList.toggle('filter-pill--active', isActive);
    button.classList.toggle('filter-pill--secondary', !isActive && !isDisabled);
    button.classList.toggle('filter-pill--disabled', isDisabled);
    button.disabled = isDisabled;
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    button.setAttribute('aria-disabled', isDisabled ? 'true' : 'false');
  }

  function renderPillsState() {
    filterConfig.forEach(function (category) {
      if (category.kind !== 'multi') return;

      category.options.forEach(function (option) {
        var selectedValues = state.multi[category.id] || [];
        var isActive = selectedValues.indexOf(option.value) !== -1;
        var isDisabled = !isActive && isOptionDisabled(category.id, option.value);

        if (category.id === 'type') {
          var quickButton = uiRefs.quickButtons[option.value];
          if (quickButton) {
            updatePillState(quickButton, isActive, isDisabled);
          }
        }

        var modalButton = uiRefs.modalButtons[category.id] && uiRefs.modalButtons[category.id][option.value];
        if (modalButton) {
          updatePillState(modalButton, isActive, isDisabled);
        }
      });
    });
  }

  function buildActiveFilters() {
    var chips = [];

    filterConfig.forEach(function (category) {
      if (category.kind === 'multi') {
        var selectedValues = state.multi[category.id] || [];
        selectedValues.forEach(function (value) {
          var option = category.options.find(function (item) {
            return item.value === value;
          });
          if (!option) return;
          chips.push({
            key: category.id + ':' + value,
            label: category.label + ': ' + option.label,
            onRemove: function () {
              toggleMultiOption(category.id, value);
            }
          });
        });
      } else {
        var selected = state.range[category.id];
        var bounds = rangeBounds[category.id];
        if (!selected || !bounds) return;
        if (selected.min === bounds.min && selected.max === bounds.max) return;

        var minLabel = formatRangeValue(category, selected.min);
        var maxLabel = formatRangeValue(category, selected.max);

        chips.push({
          key: category.id + ':' + selected.min + ':' + selected.max,
          label: category.label + ': ' + minLabel + ' - ' + maxLabel,
          onRemove: function () {
            state.range[category.id] = { min: bounds.min, max: bounds.max };
            syncRangeControls(category.id);
            applyFilter();
          }
        });
      }
    });

    return chips;
  }

  function formatRangeValue(category, value) {
    if (category.mode === 'month') return monthIndexToString(value);
    if (typeof category.formatter === 'function') return category.formatter(value);
    if (category.unit) return String(value) + ' ' + category.unit;
    return String(value);
  }

  function renderActiveChips() {
    if (!activeFiltersEl) return;
    var chips = buildActiveFilters();
    activeFiltersEl.innerHTML = '';

    if (chips.length === 0) {
      activeFiltersEl.hidden = true;
      return;
    }

    activeFiltersEl.hidden = false;
    chips.forEach(function (chip) {
      var chipButton = document.createElement('button');
      chipButton.type = 'button';
      chipButton.className = 'filter-pill filter-pill--chip';
      chipButton.innerHTML = '<span class="filter-pill__label">' + chip.label + '</span><span class="filter-pill__close" aria-hidden="true"></span>';
      chipButton.addEventListener('click', function (event) {
        event.preventDefault();
        chip.onRemove();
      });
      activeFiltersEl.appendChild(chipButton);
    });

    var resetInlineButton = document.createElement('button');
    resetInlineButton.type = 'button';
    resetInlineButton.className = 'similar-projects__active-reset';
    resetInlineButton.textContent = 'Сбросить';
    resetInlineButton.addEventListener('click', function (event) {
      event.preventDefault();
      clearAllFilters();
    });
    activeFiltersEl.appendChild(resetInlineButton);
  }

  function setHiddenState() {
    if (!hiddenInput) return;
    var payload = {};
    filterConfig.forEach(function (category) {
      if (category.kind === 'multi') {
        if ((state.multi[category.id] || []).length > 0) {
          payload[category.id] = state.multi[category.id];
        }
      } else {
        var selected = state.range[category.id];
        var bounds = rangeBounds[category.id];
        if (!selected || !bounds) return;
        if (selected.min === bounds.min && selected.max === bounds.max) return;
        payload[category.id] = {
          min: category.mode === 'month' ? monthIndexToString(selected.min) : selected.min,
          max: category.mode === 'month' ? monthIndexToString(selected.max) : selected.max
        };
      }
    });
    hiddenInput.value = JSON.stringify(payload);
  }

  function syncUrlQuery() {
    var params = new URLSearchParams(window.location.search);

    filterConfig.forEach(function (category) {
      if (category.kind === 'multi') {
        var selectedValues = state.multi[category.id] || [];
        if (selectedValues.length > 0) {
          params.set(category.id, selectedValues.join(','));
        } else {
          params.delete(category.id);
        }
      } else {
        var selected = state.range[category.id];
        var bounds = rangeBounds[category.id];
        if (!selected || !bounds || (selected.min === bounds.min && selected.max === bounds.max)) {
          params.delete(category.id);
          return;
        }
        if (category.mode === 'month') {
          params.set(category.id, monthIndexToString(selected.min) + '..' + monthIndexToString(selected.max));
        } else {
          params.set(category.id, String(selected.min) + '..' + String(selected.max));
        }
      }
    });

    var nextQuery = params.toString();
    var nextUrl = window.location.pathname + (nextQuery ? '?' + nextQuery : '') + window.location.hash;
    window.history.replaceState(null, '', nextUrl);
  }

  function updateActionTexts(visibleCount) {
    if (openFiltersButton) {
      openFiltersButton.textContent = 'Показать фильтры';
    }

    if (applySheetButton) {
      applySheetButton.textContent = 'Показать макеты (' + visibleCount + ')';
    }
  }

  function applyFilter() {
    clampState();

    Object.keys(uiRefs.rangeControls).forEach(function (categoryId) {
      syncRangeControls(categoryId);
    });

    var visibleCount = 0;
    cardData.forEach(function (item) {
      var matched = itemMatches(item, state);
      item.el.style.display = matched ? '' : 'none';
      if (matched) visibleCount += 1;
    });

    var hasAnyFilter = buildActiveFilters().length > 0;
    var noResults = hasAnyFilter && visibleCount === 0;

    if (emptyState) emptyState.hidden = !noResults;
    gallery.style.display = noResults ? 'none' : '';
    if (showMoreButton) showMoreButton.style.display = noResults ? 'none' : '';

    renderPillsState();
    renderActiveChips();
    setHiddenState();
    syncUrlQuery();
    updateActionTexts(visibleCount);
  }
});
