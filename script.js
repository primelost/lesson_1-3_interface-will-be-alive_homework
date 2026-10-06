"use strict";

// ДЗ 3. Интерактивная коллекция.
// Выполняйте практические этапы из docs/HOME_WORK.md по порядку.
// Не пытайтесь написать весь файл за один раз: после каждого этапа проверяйте
// связанный сценарий в браузере и фиксируйте рабочее состояние коммитом.

// Этап 2. Найдите карточки и элементы панели подробностей.
// Реализуйте одну общую функцию выбора карточки.

const cards = document.querySelectorAll('.collection-card');
const detailsPanel = document.getElementById('details-panel');
const detailsTitle = document.getElementById('details-title');
const detailsDescription = document.getElementById('details-description');
const filterButtons = document.querySelectorAll('.filter-button');
const visibleCountElement = document.getElementById('visible-count');
const randomButton = document.getElementById('random-button');
const resetButton = document.getElementById('reset-button');

let selectedCard = null;
let currentFilter = 'all';

function selectCard(card) {
  if (selectedCard) {
    selectedCard.classList.remove('collection-card--selected');
    selectedCard.setAttribute('aria-pressed', 'false');
  }

  selectedCard = card;
  card.classList.add('collection-card--selected');
  card.setAttribute('aria-pressed', 'true');

  const title = card.getAttribute('data-title');
  const description = card.getAttribute('data-description');

  detailsTitle.textContent = title;
  detailsDescription.textContent = description;
  detailsPanel.classList.remove('details-panel--pulse');
  void detailsPanel.offsetWidth;
  detailsPanel.classList.add('details-panel--pulse');
}

cards.forEach(card => {
  card.addEventListener('click', () => {
    selectCard(card);
  });
});

// Этап 3. Найдите кнопки фильтров.
// Показывайте подходящие карточки, обновляйте активную кнопку и счетчик.
// Учтите случай, когда новый фильтр скрывает выбранную карточку.

function updateFilter(filterValue) {
  currentFilter = filterValue;

  filterButtons.forEach(btn => {
    if (btn.getAttribute('data-filter') === filterValue) {
      btn.classList.add('filter-button--active');
      btn.setAttribute('aria-pressed', 'true');
    } else {
      btn.classList.remove('filter-button--active');
      btn.setAttribute('aria-pressed', 'false');
    }
  });

  let visibleCount = 0;
  cards.forEach(card => {
    const category = card.getAttribute('data-category');
    const isVisible = filterValue === 'all' || category === filterValue;

    if (isVisible) {
      card.classList.remove('collection-card--hidden');
      visibleCount++;
    } else {
      card.classList.add('collection-card--hidden');
      if (card === selectedCard) {
        selectedCard.classList.remove('collection-card--selected');
        selectedCard.setAttribute('aria-pressed', 'false');
        selectedCard = null;
        detailsTitle.textContent = 'Выберите карточку';
        detailsDescription.textContent = 'Здесь появится описание выбранного элемента. Используйте данные из атрибутов карточки, не дублируйте тексты в JavaScript.';
      }
    }
  });

  visibleCountElement.textContent = visibleCount;
}

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const filterValue = btn.getAttribute('data-filter');
    updateFilter(filterValue);
  });
});

// Этап 4. Реализуйте случайный выбор среди видимых карточек.
// Затем реализуйте полный сброс интерфейса.

function getVisibleCards() {
  return Array.from(cards).filter(card => !card.classList.contains('collection-card--hidden'));
}

randomButton.addEventListener('click', () => {
  const visibleCards = getVisibleCards();
  if (visibleCards.length === 0) return;

  let randomCard = visibleCards[Math.floor(Math.random() * visibleCards.length)];
  if (visibleCards.length > 1 && randomCard === selectedCard) {
    const otherCards = visibleCards.filter(card => card !== selectedCard);
    randomCard = otherCards[Math.floor(Math.random() * otherCards.length)];
  }

  selectCard(randomCard);
});

resetButton.addEventListener('click', () => {
  updateFilter('all');

  if (selectedCard) {
    selectedCard.classList.remove('collection-card--selected');
    selectedCard.setAttribute('aria-pressed', 'false');
    selectedCard = null;
  }

  detailsTitle.textContent = 'Выберите карточку';
  detailsDescription.textContent = 'Здесь появится описание выбранного элемента. Используйте данные из атрибутов карточки, не дублируйте тексты в JavaScript.';
  detailsPanel.classList.remove('details-panel--pulse');
});

