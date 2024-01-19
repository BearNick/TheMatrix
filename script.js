const matrixCodesContainer = document.getElementById('matrixCodesContainer');
const languageSelector = document.getElementById('languageSelector');
const coffeeButton = document.getElementById('coffeeButton');
const latinButton = document.getElementById('latinButton');
const binaryButton = document.getElementById('binaryButton');
const hebrewButton = document.getElementById('hebrewButton');
const clmnButton = document.getElementById('clmnButton');
const colorButton = document.getElementById('colorButton');
const colorPicker = document.getElementById('colorPicker');
// Используем touchstart вместо click для мобильных устройств
const clickEvent = ('ontouchstart' in window) ? 'touchstart' : 'click';
colorPicker.addEventListener('input', function () {
  changeColor(colorPicker.value);
});

function changeColor(newColor) {
  // Применяем новый цвет ко всем элементам с классом 'matrix-code'
  const matrixCodeElements = document.querySelectorAll('.matrix-code span');
  matrixCodeElements.forEach(element => {
    element.style.color = newColor;
  });
  // Применяем новый цвет ко всем кнопкам
const buttons = document.querySelectorAll('.matrix-button, .clmn-button, .latin-button, .binary-button, .hebrew-button, .coffee-button, .color-button');
buttons.forEach(button => {
  button.style.color = newColor;
});
}

colorButton.addEventListener('click', function () {
  colorPicker.click(); // Эмулируем клик по элементу выбора цвета
});

colorPicker.addEventListener('input', function () {
  const selectedColor = colorPicker.value;
  // Здесь вы можете выполнить дополнительные действия с выбранным цветом
  console.log('Selected Color:', selectedColor);
});

// Отображение/скрытие палитры при выборе цвета
colorPicker.addEventListener('change', function () {
  colorPicker.style.display = 'none';
});

colorButton.addEventListener('click', function () {
  colorPicker.style.display = 'block';
});

const numberOfColumns = 199;
let selectedLanguage = 'The Matrix';
let symbolChangeSpeed = 100;
let lastSymbolChangeSpeed = 1;

function getRandomChar() {
  let characters = '';

  if (selectedLanguage === 'The Matrix') {
    characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  }
  else if (selectedLanguage === 'Latin') {
    characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  }
   else if (selectedLanguage === 'Binary') {
    characters = '01';
  }
  else if (selectedLanguage === 'Hebrew') {
    characters = '0123456789!@#$%^&*()_+-=[]{}|;:,.<>?אבגדהוזחטיכלמנסעפצקרשת';
  }

  const randomIndex = Math.floor(Math.random() * characters.length);
  return characters.charAt(randomIndex);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function createMatrixCodeElement() {
  const matrixCodeElement = document.createElement('div');
  matrixCodeElement.className = 'matrix-code';
  const codeColumn = createMatrixCodeColumn();
  matrixCodeElement.innerHTML = codeColumn.map(char => `<span>${char}</span>`).join('');

  return matrixCodeElement;
}

function updateMatrixCodeElement(matrixCodeElement) {
  const spans = matrixCodeElement.querySelectorAll('span');

  if (spans.length > 0) {
    const numberOfChanges = getRandomInt(1, 9);

    for (let i = 0; i < numberOfChanges; i++) {
      const randomIndex = getRandomInt(0, spans.length - 1);
      spans[randomIndex].textContent = getRandomChar();
    }
  }
}


function setLastSymbolChangeSpeed(matrixCodeElement, speed) {
  const lastSpan = matrixCodeElement.querySelector('span:last-child');
  lastSpan.style.transition = `color ${speed}ms`;
}

function createMatrixCodeColumn() {
  const column = [];
  const columnLength = getRandomInt(1, 55);

  for (let i = 1; i < columnLength; i++) {
    column.push(getRandomChar());
  }
  setTimeout(() => {
    coffeeButton.style.display = 'block';
    latinButton.style.display = 'block';
    binaryButton.style.display = 'block';
    hebrewButton.style.display = 'block';
    clmnButton.style.display = 'block';
    colorButton.style.display = 'block';
    colorPicker.style.display = 'block';

  }, 5000);
  return column;
}

function startMatrixAnimation() {
  matrixCodesContainer.innerHTML = '';
  languageSelector.style.display = 'none';

  const numberOfLayers = 111;

  for (let layer = 1; layer <= numberOfLayers; layer++) {
    for (let i = 0; i < 111; i++) {
      const matrixCodeElement = createMatrixCodeElement();
      const animationDuration = getRandomInt(3999, 6666) / 1000;
      const animationDelay = getRandomInt(100, 1111) / 100;

      matrixCodeElement.style.animation = `fall ${animationDuration}s ${animationDelay}s linear infinite, flicker 0.1s infinite`;
      matrixCodeElement.style.zIndex = layer;

      setInterval(() => {
        updateMatrixCodeElement(matrixCodeElement);
      }, symbolChangeSpeed);

      setLastSymbolChangeSpeed(matrixCodeElement, lastSymbolChangeSpeed);

      matrixCodesContainer.appendChild(matrixCodeElement);
    }
  }
}
coffeeButton.addEventListener('click', function () {
  window.open('https://www.buymeacoffee.com/themtrx', '_blank');
});

latinButton.addEventListener('click', function () {
  selectedLanguage = 'Latin';
});

binaryButton.addEventListener('click', function () {
  selectedLanguage = 'Binary';
});

hebrewButton.addEventListener('click', function () {
  selectedLanguage = 'Hebrew';
});
clmnButton.addEventListener('click', function () {
  const numberOfColumnsToAdd = 199; // Количество столбцов для добавления

  for (let i = 0; i < numberOfColumnsToAdd; i++) {
    const matrixCodeElement = createMatrixCodeElement();
    const animationDuration = getRandomInt(3333, 6666) / 1000;
    const animationDelay = getRandomInt(1, 7) / 100;

    matrixCodeElement.style.animation = `fall ${animationDuration}s ${animationDelay}s linear infinite, flicker 0.1s infinite`;
    matrixCodeElement.style.zIndex = 1000; // Устанавливаем на верхний уровень

    // Добавляем символы кода и настраиваем обновление символов
    setInterval(() => {
      updateMatrixCodeElement(matrixCodeElement);
    }, symbolChangeSpeed);

    setLastSymbolChangeSpeed(matrixCodeElement, lastSymbolChangeSpeed);

    matrixCodesContainer.appendChild(matrixCodeElement);
  }
});

// Ваш код создания кнопки "More Code" и добавления ее на страницу
function createLanguageButtons() {
  const languages = ['The Matrix'];
  languages.forEach(language => {
    const button = document.createElement('button');
    button.textContent = language.charAt(0).toUpperCase() + language.slice(1);
    button.className = 'matrix-button';
    button.onclick = () => {
      selectedLanguage = language;
      startMatrixAnimation();
    };
    languageSelector.appendChild(button);
  });

  // Добавляем комментарий к кнопке "The Matrix"
    const matrixButton = document.querySelector('.matrix-button');
    matrixButton.title = 'are Watching...';
  }
createLanguageButtons();
