/* === Matrix Rain — film style, fixed with Nik's requests (v5.0) === */
(() => {
  const canvas = document.getElementById('matrix');
  const ctx = canvas.getContext('2d', { alpha: false });

  // UI elements
  const ui = {
    speed: document.getElementById('speed'),
    speedVal: document.getElementById('speedVal'),
    font: document.getElementById('font'),
    fontVal: document.getElementById('fontVal'),
    trail: document.getElementById('trail'),
    trailVal: document.getElementById('trailVal'),
    bright: document.getElementById('bright'),
    brightVal: document.getElementById('brightVal'),
    rotation: document.getElementById('rotation'),
    rotationVal: document.getElementById('rotationVal'),
    alphabet: document.getElementById('alphabet'),
    intro: document.getElementById('intro'),
    rotate: document.getElementById('rotate'),
    perf: document.getElementById('perf'),
    coffee: document.getElementById('coffee')
  };
  const hint = document.getElementById('hint');

  // --- State ---
  let DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  let W = 0, H = 0;
  let fontSize = parseInt(ui.font.value, 10);
  let colCount = 0;
  let colX = [];
  let y = [];
  let v = [];
  let rot = [];
  let rotSign = [];   // фиксированное направление вращения
  let trailLen = [];  // длина хвоста для каждой колонны
  let glyphs = buildGlyphs(ui.alphabet.value);
  let running = false;
  let lastTs = 0;
  let trailAlpha = parseFloat(ui.trail.value);
  let speedScale = parseFloat(ui.speed.value);
  let brightness = parseFloat(ui.bright.value);
  let rotationScale = parseFloat(ui.rotation.value); // от слайдера
  let eco = ui.perf.checked;

  // --- Helpers ---
  function buildGlyphs(mode){
    if(mode === 'latin'){
      return ('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$+-*/=%\'"\\|_<>!?:;.,()[]{}').split('');
    }else if(mode === 'binary'){
      return ('01').split('');
    }else if(mode === 'hebrew'){
      const heb = Array.from({length:27}, (_,i)=> String.fromCharCode(0x05D0 + i)).join('');
      return (heb + '0123456789').split('');
    }else{
      const kat = [];
      for(let cp=0x30A0; cp<=0x30FF; cp++){
        if (cp===0x30FB) continue;
        kat.push(String.fromCharCode(cp));
      }
      const ascii = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      return (kat.join('') + ascii).split('');
    }
  }

  function rand(a,b){ return a + Math.random()*(b-a); }
  function randi(a,b){ return Math.floor(rand(a,b+1)); }
  const pick = arr => arr[randi(0,arr.length-1)];

  function resize(){
    const rect = canvas.getBoundingClientRect();
    DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    W = Math.floor(rect.width * DPR);
    H = Math.floor(rect.height * DPR);
    canvas.width = W;
    canvas.height = H;
    ctx.setTransform(1,0,0,1,0,0);
    ctx.scale(DPR, DPR);

    fontSize = parseInt(ui.font.value, 10);
    ctx.font = `${fontSize}px "Courier New", ui-monospace, monospace`;
    ctx.textBaseline = 'top';

    colCount = Math.floor(rect.width / fontSize);
    colX = new Array(colCount);
    y = new Array(colCount);
    v = new Array(colCount);
    rot = new Array(colCount);
    rotSign = new Array(colCount);
    trailLen = new Array(colCount);

    for(let i=0;i<colCount;i++){
      colX[i] = i * fontSize;
      y[i] = rand(-H/fontSize, 0);
      const base = eco ? rand(8,16) : rand(14,24);
      v[i] = base;
      rot[i] = rand(0, Math.PI*2);
      rotSign[i] = Math.random() < 0.5 ? -1 : 1;
      trailLen[i] = randi(5, 30); // у каждой колонны своя длина хвоста
    }

    ctx.fillStyle = '#000';
    ctx.fillRect(0,0,rect.width,rect.height);
  }

  // Цвета "как в фильме"
  const headColor = '#ffffff';
  const brightGreen = '#0aff0a';
  const mediumGreen = '#00cc00';
  const darkGreen = '#009900';

  function drawFrame(ts){
    if(!running){ lastTs = ts; requestAnimationFrame(drawFrame); return; }
    const rect = canvas.getBoundingClientRect();
    const dt = Math.min(0.05, (ts - lastTs) * 0.001 || 0.016);
    lastTs = ts;

    // Затухание — чёрный фон с прозрачностью
    ctx.globalAlpha = trailAlpha;
    ctx.fillStyle = '#000';
    ctx.fillRect(0,0,rect.width,rect.height);
    ctx.globalAlpha = 1;

    const step = eco ? 2 : 1;
    for(let i=0;i<colCount;i+=step){
      y[i] += v[i] * speedScale * dt;

      if(y[i]*fontSize > rect.height + randi(0, 20)*fontSize){
        y[i] = -randi(5, 30);
        v[i] = (eco ? rand(8,16) : rand(14,24));
        trailLen[i] = randi(5, 30);
      }

      const px = Math.floor(colX[i]);
      const py = Math.floor(y[i] * fontSize);
      const headChar = pick(glyphs);

      for (let j = 0; j < trailLen[i]; j++) {
        const trailY = py - (j * fontSize);
        if (trailY < -fontSize || trailY > rect.height + fontSize) continue;

        const trailChar = j === 0 ? headChar : pick(glyphs);
        const position = j / trailLen[i];
        const alpha = 1.0 - position * 0.9;

        ctx.save();

        if (j === 0 && ui.rotate.checked && rotationScale > 0) {
          rot[i] += (rotationScale * 0.5) * rotSign[i] * dt;
          ctx.translate(px + fontSize*0.5, py + fontSize*0.5);
          ctx.rotate(rot[i]);
          ctx.translate(-fontSize*0.5, -fontSize*0.5);
        } else {
          ctx.translate(px, trailY);
        }

        // Цветовые градации
        if (j === 0) {
          ctx.fillStyle = headColor;
          ctx.globalAlpha = Math.min(1, 0.9 * brightness);
          ctx.shadowColor = 'rgba(255,255,255,0.8)';
          ctx.shadowBlur = eco ? 6 : 15;
        } else if (j === 1) {
          ctx.fillStyle = brightGreen;
          ctx.globalAlpha = 0.9 * alpha;
          ctx.shadowColor = 'rgba(0,255,102,0.6)';
          ctx.shadowBlur = eco ? 4 : 10;
        } else if (j < 8) {
          ctx.fillStyle = mediumGreen;
          ctx.globalAlpha = 0.7 * alpha;
          ctx.shadowBlur = eco ? 2 : 5;
        } else {
          ctx.fillStyle = darkGreen;
          ctx.globalAlpha = 0.5 * alpha;
          ctx.shadowBlur = 0;
        }

        ctx.fillText(trailChar, 0, 0);
        ctx.restore();
      }
    }

    requestAnimationFrame(drawFrame);
  }

  // --- Intro ---
  let introTime = 0;
  function playIntroStep(ts){
    const rect = canvas.getBoundingClientRect();
    const dt = Math.min(0.05, (ts - lastTs) * 0.001 || 0.016);
    lastTs = ts;
    introTime += dt;

    ctx.globalAlpha = 1;
    ctx.fillStyle = '#000';
    ctx.fillRect(0,0,rect.width,rect.height);

    const title = "THE MATRIX";
    const sub = "WAKE UP, NEO";

    ctx.save();
    ctx.translate(rect.width/2, rect.height/2);
    const jitterX = (Math.random()-0.5) * 2;
    const jitterY = (Math.random()-0.5) * 2;

    ctx.shadowColor = '#0aff0a';
    ctx.shadowBlur = 24;
    ctx.fillStyle = '#b9ffda';
    ctx.textAlign = 'center';

    const size = Math.min(rect.width, rect.height) * 0.12;
    ctx.font = `700 ${Math.max(28, size)}px "Courier New", monospace`;
    ctx.fillText(title, jitterX, jitterY);

    ctx.shadowBlur = 10;
    ctx.globalAlpha = 0.8 + Math.sin(introTime*6)*0.2;
    ctx.font = `400 ${Math.max(12, size*0.25)}px "Courier New", monospace`;
    ctx.fillStyle = '#7bffb3';
    ctx.fillText(sub, jitterX, Math.max(40, size*0.6) + jitterY);
    ctx.restore();

    for(let i=0;i<6;i++){
      const yLine = randi(0, rect.height);
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = '#00ff66';
      ctx.fillRect(0, yLine, rect.width, 1);
    }
    ctx.globalAlpha = 1;

    if(introTime > 2.2){
      const alpha = Math.min(1, (introTime-2.2)/0.6);
      ctx.fillStyle = `rgba(0,0,0,${alpha})`;
      ctx.fillRect(0,0,rect.width,rect.height);
    }

    if(introTime < 2.8){
      requestAnimationFrame(playIntroStep);
    }else{
      running = true;
      lastTs = performance.now();
      requestAnimationFrame(drawFrame);
    }
  }

  // --- Events & UI ---
  function attachUI(){
    ui.speed.addEventListener('input', () => {
      speedScale = parseFloat(ui.speed.value);
      ui.speedVal.textContent = speedScale.toFixed(1) + 'x';
    }, {passive:true});

    ui.font.addEventListener('input', () => {
      fontSize = parseInt(ui.font.value,10);
      ui.fontVal.textContent = fontSize + 'px';
      resize();
    }, {passive:true});

    ui.trail.addEventListener('input', () => {
      trailAlpha = parseFloat(ui.trail.value);
      ui.trailVal.textContent = trailAlpha.toFixed(2);
    }, {passive:true});

    ui.bright.addEventListener('input', () => {
      brightness = parseFloat(ui.bright.value);
      ui.brightVal.textContent = brightness.toFixed(1);
    }, {passive:true});

    ui.rotation.addEventListener('input', () => {
      rotationScale = parseFloat(ui.rotation.value);
      ui.rotationVal.textContent = rotationScale.toFixed(1);
    }, {passive:true});

    ui.alphabet.addEventListener('change', () => {
      glyphs = buildGlyphs(ui.alphabet.value);
    }, {passive:true});

    ui.perf.addEventListener('change', () => {
      eco = ui.perf.checked;
      resize();
    }, {passive:true});

    ui.coffee.addEventListener('click', () => {
      window.open('https://venmo.com/u/ConservaThor', '_blank');
    }, {passive:true});
  }

  function start(){
    hint.classList.add('hide');
    resize();
    if(ui.intro.checked){
      running = false;
      introTime = 0;
      lastTs = performance.now();
      requestAnimationFrame(playIntroStep);
    }else{
      running = true;
      lastTs = performance.now();
      requestAnimationFrame(drawFrame);
    }
  }

  ['click','touchstart','keydown'].forEach(ev => {
    window.addEventListener(ev, () => {
      if(!running && hint){
        start();
      }
    }, {passive:true, once:true});
  });

  window.addEventListener('resize', () => {
    resize();
  }, {passive:true});

  // Init
  attachUI();
  resize();
})();
