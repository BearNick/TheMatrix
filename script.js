/* === Matrix script v2.10 === */
const matrixCodesContainer = document.getElementById('matrixCodesContainer');
const languageSelector = document.getElementById('languageSelector');
const coffeeButton = document.getElementById('coffeeButton');
const latinButton = document.getElementById('latinButton');
const binaryButton = document.getElementById('binaryButton');
const hebrewButton = document.getElementById('hebrewButton');
const clmnButton = document.getElementById('clmnButton');
const colorButton = document.getElementById('colorButton');
const colorPicker = document.getElementById('colorPicker');
const reverseButton = document.getElementById('reverseButton');
const controls = document.getElementById('controls');
const speedSlider = document.getElementById('speedSlider');

// Use touchstart on mobile
const clickEvent = ('ontouchstart' in window) ? 'touchstart' : 'click';

// ===== Color handling via CSS variables =====
function hexToHsl(hex){
  let r=0,g=0,b=0;
  if(hex.length==4){ r="0x"+hex[1]+hex[1]; g="0x"+hex[2]+hex[2]; b="0x"+hex[3]+hex[3]; }
  else if(hex.length==7){ r="0x"+hex[1]+hex[2]; g="0x"+hex[3]+hex[4]; b="0x"+hex[5]+hex[6]; }
  r/=255; g/=255; b/=255;
  const max=Math.max(r,g,b), min=Math.min(r,g,b);
  let h=0,s=0,l=(max+min)/2;
  if(max!==min){
    const d=max-min;
    s = l>0.5 ? d/(2-max-min) : d/(max+min);
    switch(max){
      case r: h=(g-b)/d + (g<b?6:0); break;
      case g: h=(b-r)/d + 2; break;
      case b: h=(r-g)/d + 4; break;
    }
    h/=6;
  }
  return {h,s,l};
}
function hslToHex(h,s,l){
  function f(n){
    const k=(n+h*12)%12;
    const a=s*Math.min(l,1-l);
    const c=l - a*Math.max(-1, Math.min(k-3, Math.min(9-k,1)));
    return Math.round(255*c).toString(16).padStart(2,'0');
  }
  return "#"+f(0)+f(8)+f(4);
}
function changeColor(newColor) {
  // base color
  document.documentElement.style.setProperty('--code-color', newColor);
  // brighter head color
  try{
    const {h,s,l}=hexToHsl(newColor);
    const head = hslToHex(h, Math.min(1, s*0.9), Math.min(1, l+0.25));
    document.documentElement.style.setProperty('--head-color', head);
  }catch(e){ /* ignore */ }
}

// Color UI
colorButton.addEventListener('click', () => {
  colorPicker.style.display = 'block';
  colorPicker.click();
});
colorPicker.addEventListener('input', () => changeColor(colorPicker.value));
colorPicker.addEventListener('change', () => { colorPicker.style.display = 'none'; });

// ===== Matrix logic =====
let selectedLanguage = 'The Matrix';
let isReversed = false;
// symbol change speed (ms) controlled by slider; default matches slider value
let symbolChangeMs = parseInt(speedSlider?.value || "120", 10);

// Keep references to intervals so we can change speed at runtime
const intervalRegistry = new Set();

function clearAllIntervals(){
  for(const id of intervalRegistry){
    clearInterval(id);
  }
  intervalRegistry.clear();
}

function getRandomChar() {
  let characters = '';
  if (selectedLanguage === 'The Matrix' || selectedLanguage === 'Latin') {
    characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  } else if (selectedLanguage === 'Binary') {
    characters = '01';
  } else if (selectedLanguage === 'Hebrew') {
    characters = '0123456789!@#$%^&*()_+-=[]{}|;:,.<>?אבגדהוזחטיכלמנסעפצקרשת';
  }
  const randomIndex = Math.floor(Math.random() * characters.length);
  return characters.charAt(randomIndex);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createMatrixCodeElement() {
  const el = document.createElement('div');
  el.className = 'matrix-code';
  const lineCount = Math.floor(window.innerHeight / 20); // approx line height
  const column = [];
  const columnLength = getRandomInt(Math.max(8, Math.floor(lineCount*0.35)), Math.max(12, Math.floor(lineCount*0.9)));
  for (let i = 0; i < columnLength; i++) {
    column.push(`<span>${getRandomChar()}</span>`);
  }
  el.innerHTML = column.join('');
  return el;
}

function updateMatrixCodeElement(el) {
  const spans = el.querySelectorAll('span');
  if (spans.length === 0) return;
  const changes = getRandomInt(1, Math.min(9, spans.length));
  for (let i = 0; i < changes; i++) {
    const idx = getRandomInt(0, spans.length - 1);
    spans[idx].textContent = getRandomChar();
  }
}

function startUpdater(el){
  const id = setInterval(() => updateMatrixCodeElement(el), symbolChangeMs);
  intervalRegistry.add(id);
  // clean up if element removed
  el.addEventListener('remove', () => { clearInterval(id); intervalRegistry.delete(id); }, {once:true});
}

function applyAnimation(el){
  const duration = getRandomInt(3500, 6500) / 1000;
  const delay = getRandomInt(0, 1000) / 1000;
  const base = isReversed ? 'fall-reverse' : 'fall';
  el.style.animation = `${base} ${duration}s ${delay}s linear infinite`;
}

function populateColumns(count){
  for(let i=0;i<count;i++){
    const el = createMatrixCodeElement();
    applyAnimation(el);
    startUpdater(el);
    matrixCodesContainer.appendChild(el);
  }
}

function startMatrixAnimation() {
  matrixCodesContainer.innerHTML = '';
  clearAllIntervals();
  languageSelector.style.display = 'none';

  // Compute sensible number of columns based on viewport
  const approxCharWidth = 12; // px
  const columns = Math.floor(window.innerWidth / approxCharWidth / 2); // half-density looks nicer
  populateColumns(Math.max(60, columns)); // ensure minimum
}

// Buttons
coffeeButton.addEventListener('click', () => window.open('https://venmo.com/u/ConservaThor', '_blank'));
latinButton.addEventListener('click', () => { selectedLanguage = 'Latin'; });
binaryButton.addEventListener('click', () => { selectedLanguage = 'Binary'; });
hebrewButton.addEventListener('click', () => { selectedLanguage = 'Hebrew'; });

clmnButton.addEventListener('click', () => {
  // Add a burst of columns
  populateColumns(40);
});

reverseButton.addEventListener('click', () => {
  isReversed = !isReversed;
  const nodes = document.querySelectorAll('.matrix-code');
  nodes.forEach(n => applyAnimation(n));
});

// Speed control: restart all updaters with new interval
if (speedSlider){
  speedSlider.addEventListener('input', () => {
    symbolChangeMs = parseInt(speedSlider.value,10);
    clearAllIntervals();
    document.querySelectorAll('.matrix-code').forEach(el => startUpdater(el));
  });
}

// Language menu
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
  const matrixButton = document.querySelector('.matrix-button');
  matrixButton.title = 'are Watching...';
}
createLanguageButtons();

// Reveal UI after short intro
setTimeout(() => {
  [coffeeButton, latinButton, binaryButton, hebrewButton, clmnButton, colorButton, reverseButton].forEach(b => b.style.display='block');
  controls.style.display = 'flex';
  // Start with default color sync
  changeColor(getComputedStyle(document.documentElement).getPropertyValue('--code-color') || '#00ff00');
}, 2000);
