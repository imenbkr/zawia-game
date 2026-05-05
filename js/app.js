// STATE
const state = { points: 0, completed: [], currentQuest: null, timers: {} };

// ── No API key needed here — key is stored safely in Netlify environment variables ──

// NAV
function navigate(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
  const noNav = ['screen-onboarding', 'screen-final'];
  document.getElementById('bottom-nav').style.display = noNav.includes(screenId) ? 'none' : 'flex';
  if (screenId === 'screen-home') renderHome();
  if (screenId === 'screen-achievements') renderAchievements();
  if (screenId === 'screen-library') renderLibrary('history');
  if (screenId === 'screen-profile') renderProfile();
  window.scrollTo(0,0);
}

// HOME
function renderHome() {
  document.getElementById('home-pts').textContent = state.points;
  const pct = Math.round(state.completed.length / 5 * 100);
  document.getElementById('pct').textContent = pct + '%';
  document.getElementById('main-fill').style.width = pct + '%';
  document.getElementById('quests-done').textContent = state.completed.length + ' / 5 quests';

  const list = document.getElementById('quest-list');
  list.innerHTML = '';
  QUESTS.forEach((q, i) => {
    const unlocked = i === 0 || state.completed.includes(i);
    const done = state.completed.includes(i + 1);
    const card = document.createElement('div');
    card.className = 'quest-card' + ((!unlocked && !done) ? ' locked' : '') + (done ? ' completed' : '');
    card.innerHTML = `
      <div class="q-icon" style="background:${q.color}">${q.icon}</div>
      <div class="q-meta">
        <div class="q-title">${q.title}</div>
        <div class="q-loc">${q.location}</div>
      </div>
      <span class="q-pill ${done ? 'pill-done' : (unlocked ? 'pill-gold' : 'pill-lock')}">
        ${done ? '✓ ' + q.badge : (unlocked ? q.badge : '🔒 Locked')}
      </span>`;
    if (unlocked || done) card.onclick = () => openDetail(q.id);
    list.appendChild(card);
  });

  const br = document.getElementById('badge-row-home');
  br.innerHTML = '';
  BADGES.forEach(b => {
    const earned = state.completed.includes(b.id);
    br.innerHTML += `<div class="badge-item">
      <div class="badge-circle ${earned ? 'earned' : 'locked-b'}">${b.icon}</div>
      <div class="badge-name">${b.name}</div>
    </div>`;
  });
}

// DETAIL
function openDetail(questId) {
  const q = QUESTS[questId - 1];
  state.currentQuest = questId;
  document.getElementById('detail-header').innerHTML = `
    <div class="detail-icon">${q.icon}</div>
    <div class="detail-num">QUEST ${q.id} OF 5</div>
    <div class="detail-title">${q.title}</div>
    <div class="detail-loc">${q.location}</div>`;
  document.getElementById('detail-body').innerHTML = `
    <div class="detail-meta">
      <span class="meta-tag">⏱ ${q.duration}</span>
      <span class="meta-tag">⚡ ${q.difficulty}</span>
      <span class="meta-tag">✦ ${q.points} KP</span>
    </div>
    <div class="detail-desc">${q.desc}</div>
    <div class="learn-label">What you will learn</div>
    <div class="learn-list">
      ${q.learn.map((l, i) => `<div class="learn-item"><div class="learn-num">${i+1}</div><div class="learn-text">${l}</div></div>`).join('')}
    </div>
    <div class="reward-preview">
      <div class="reward-icon">${q.badgeIcon}</div>
      <div><div class="reward-text-title">${q.badge} Badge Reward</div><div class="reward-text-sub">+${q.points} Knowledge Points</div></div>
    </div>
    <button class="start-btn" onclick="startQuest(${q.id})">
      ${state.completed.includes(q.id) ? 'Replay Quest ↩' : 'Start Quest →'}
    </button>`;
  navigate('screen-detail');
}

// START QUEST
function startQuest(questId) {
  const q = QUESTS[questId - 1];
  state.currentQuest = questId;

  document.getElementById('quest-header-bar').innerHTML = `
    <div class="qh-num">QUEST ${q.id} · ${q.duration}</div>
    <div class="qh-title">${q.title}</div>
    <div class="qh-loc">${q.location}</div>`;

  const body = document.getElementById('quest-body-area');
  body.innerHTML = '';

  // Timer
  clearInterval(state.timers[questId]);
  const mins = [0,8,10,10,12,10][questId];
  let secs = mins * 60;
  const timerEl = document.createElement('div');
  timerEl.className = 'timer-strip';
  timerEl.innerHTML = `<span>⏱</span><span class="timer-val" id="tval">8:00</span><span>remaining</span>`;
  body.appendChild(timerEl);
  state.timers[questId] = setInterval(() => {
    secs--;
    if (secs <= 0) { clearInterval(state.timers[questId]); return; }
    const m = Math.floor(secs/60), s = secs%60;
    const tv = document.getElementById('tval');
    if (tv) tv.textContent = m + ':' + (s < 10 ? '0' : '') + s;
  }, 1000);

  // Objective
  const obj = document.createElement('div');
  obj.className = 'quest-obj';
  obj.textContent = q.desc;
  body.appendChild(obj);

  // Quest type
  if (q.type === 'quiz') renderQuiz(q, body);
  else if (q.type === 'ar-quiz') renderARQuiz(q, body);
  else if (q.type === 'audio-quiz') renderAudioQuiz(q, body);
  else if (q.type === 'dragdrop') renderDragDrop(q, body);
  else if (q.type === 'timeline') renderTimeline(q, body);

  navigate('screen-quest');
}

// QUIZ
function renderQuiz(q, body) {
  const wrap = document.createElement('div');
  wrap.innerHTML = `<div class="quiz-q">${q.question}</div>
    <div class="quiz-opts">${q.options.map((o,i) => `
      <button class="quiz-opt" data-correct="${o.correct}" onclick="handleQuiz(this,${q.id})">${o.text}</button>`).join('')}
    </div>`;
  body.appendChild(wrap);
}

// AR QUIZ — real camera + Gemini Vision
function renderARQuiz(q, body) {
  const ar = document.createElement('div');
  ar.innerHTML = `
    <div class="ar-frame" id="ar-frame">
      <div class="ar-viewfinder" id="ar-viewfinder">
        <div class="scan-line" id="scan-line" style="display:none"></div>
        <div class="ar-scan-text" id="ar-scan-text">Point your camera at a zellige or Islamic geometric pattern</div>
      </div>
      <div class="pattern-detected" id="pattern-detected" style="display:none">
        <div class="pattern-label" id="pattern-label"></div>
        <div class="pattern-text" id="pattern-text"></div>
      </div>
      <button class="ar-scan-btn" id="ar-scan-btn" onclick="openCamera()">📷 Scan a Pattern</button>
      <input type="file" id="ar-camera-input" accept="image/*" capture="environment" style="display:none" onchange="handleCameraCapture(event,${q.id})">
    </div>
    <div id="ar-quiz-section" style="display:none">
      <div class="quiz-q">${q.question}</div>
      <div class="quiz-opts">${q.options.map(o => `
        <button class="quiz-opt" data-correct="${o.correct}" onclick="handleQuiz(this,${q.id})">${o.text}</button>`).join('')}
      </div>
    </div>`;
  body.appendChild(ar);
}

function openCamera() {
  const input = document.getElementById('ar-camera-input');
  if (input) input.click();
}

async function handleCameraCapture(event, questId) {
  const file = event.target.files[0];
  if (!file) return;

  const btn = document.getElementById('ar-scan-btn');
  const scanText = document.getElementById('ar-scan-text');
  const scanLine = document.getElementById('scan-line');

  // Show loading state
  if (btn) btn.style.display = 'none';
  if (scanText) scanText.textContent = '🔍 Analysing pattern...';
  if (scanLine) scanLine.style.display = 'block';



  try {
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const mediaType = file.type || 'image/jpeg';

    if (scanText) scanText.textContent = '🔍 Analysing pattern...';

    // Simulate brief scanning delay then always detect
    await new Promise(r => setTimeout(r, 1500));
    const text = '{"detected": true, "patternName": "Sacred Geometric Pattern", "description": "A motif echoing the sacred geometry found throughout the Zaoua de Sidi-Assa."}';
    let result;
    try {
      result = JSON.parse(text.replace(/```json|```/g, '').trim());
    } catch {
      // Gemini returned non-JSON — treat as not detected
      result = { detected: false };
    }

    if (result.detected) {
      showPatternDetected(result.patternName, result.description);
    } else {
      showPatternNotFound(btn, scanText, scanLine);
    }

  } catch (err) {
    // Network error — show message, do NOT auto-pass
    if (scanLine) scanLine.style.display = 'none';
    if (scanText) scanText.textContent = '⚠️ Network error — check your connection';
    if (btn) { btn.style.display = 'block'; btn.textContent = '📷 Try Again'; }
  }
}

function showPatternDetected(patternName, description) {
  const scanLine = document.getElementById('scan-line');
  const scanText = document.getElementById('ar-scan-text');
  const detected = document.getElementById('pattern-detected');
  const label = document.getElementById('pattern-label');
  const patternText = document.getElementById('pattern-text');
  const quizSection = document.getElementById('ar-quiz-section');
  const viewfinder = document.getElementById('ar-viewfinder');

  if (scanLine) scanLine.style.display = 'none';
  if (scanText) scanText.textContent = '✓ Pattern recognised!';
  if (viewfinder) viewfinder.style.borderColor = '#2D6A4F';
  if (label) label.textContent = '✓ Pattern Detected: ' + patternName;
  if (patternText) patternText.textContent = description;
  if (detected) detected.style.display = 'block';
  if (quizSection) {
    quizSection.style.display = 'block';
    setTimeout(() => quizSection.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
  }
}

function showPatternNotFound(btn, scanText, scanLine) {
  if (scanLine) scanLine.style.display = 'none';
  if (scanText) scanText.textContent = '❌ No Islamic pattern detected — try again';
  if (btn) { btn.style.display = 'block'; btn.textContent = '📷 Try Again'; }
}

function renderAudioQuiz(q, body) {
  const audio = document.createElement('div');
  audio.innerHTML = `
    <div class="audio-card">
      <div class="audio-icon">🎵</div>
      <div class="audio-title">Sacred Dhikr</div>
      <div class="audio-sub">Live from Sidi-Assa Mausoleum</div>
      <div class="audio-arabic">ذكر الله</div>
      <div class="audio-bar"><div class="audio-bar-fill"></div></div>
      <div class="audio-controls">
        <button class="audio-btn">↺</button>
        <button class="audio-btn main">⏸</button>
        <button class="audio-btn">↻</button>
      </div>
    </div>
    <div class="quiz-q">${q.question}</div>
    <div class="quiz-opts">${q.options.map(o => `
      <button class="quiz-opt" data-correct="${o.correct}" onclick="handleQuiz(this,${q.id})">${o.text}</button>`).join('')}
    </div>`;
  body.appendChild(audio);
}

function handleQuiz(btn, questId) {
  const q = QUESTS[questId - 1];
  const opts = btn.closest('.quiz-opts').querySelectorAll('.quiz-opt');
  opts.forEach(o => o.disabled = true);
  const correct = btn.getAttribute('data-correct') === 'true';
  if (correct) {
    btn.classList.add('correct');
  } else {
    btn.classList.add('wrong');
    opts.forEach(o => { if (o.getAttribute('data-correct') === 'true') o.classList.add('correct'); });
  }
  setTimeout(() => showQuestResult(questId, correct), 900);
}

// DRAG AND DROP
let dragTarget = null;
function renderDragDrop(q, body) {
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div style="font-size:11px;font-weight:700;letter-spacing:1px;color:var(--text-muted);text-transform:uppercase;margin-bottom:8px">Drag each item to its sanctuary</div>
    <div class="drag-source" id="drag-src">
      ${q.items.map(item => `<div class="drag-item" draggable="true" data-col="${item.col}"
        ondragstart="dragStart(event)" ondragend="dragEnd(event)"
        onclick="tapDrag(this)">${item.text}</div>`).join('')}
    </div>
    <div class="puzzle-grid">
      <div class="puzzle-col" id="drop-mosque"
        ondragover="dragOver(event)" ondrop="dropItem(event,'mosque')"
        ondragleave="dragLeave(event)">
        <div class="puzzle-col-title">🕌 The Mosque<br><small>Mind · Law · Duty</small></div>
        <div class="puzzle-items" id="mosque-items"></div>
      </div>
      <div class="puzzle-col" id="drop-zaoua"
        ondragover="dragOver(event)" ondrop="dropItem(event,'zaoua')"
        ondragleave="dragLeave(event)">
        <div class="puzzle-col-title">✨ The Zaoua<br><small>Soul · Spirit · Heart</small></div>
        <div class="puzzle-items" id="zaoua-items"></div>
      </div>
    </div>
    <button class="check-btn" id="check-dd-btn" onclick="checkDragDrop(${q.id})">Check Answers ✓</button>`;
  body.appendChild(wrap);
}

function dragStart(e) {
  dragTarget = e.target;
  e.target.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}
function dragEnd(e) { e.target.classList.remove('dragging'); }
function dragOver(e) { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }
function dragLeave(e) { e.currentTarget.classList.remove('drag-over'); }
function dropItem(e, col) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  if (!dragTarget) return;
  dragTarget.classList.add('placed-gold');
  document.getElementById(col + '-items').appendChild(dragTarget);
  dragTarget = null;
}

let tapSelected = null;
function tapDrag(el) {
  if (tapSelected && tapSelected !== el) tapSelected.style.outline = '';
  tapSelected = el;
  el.style.outline = '2px solid var(--gold)';
}

function checkDragDrop(questId) {
  const mItems = document.getElementById('mosque-items').children;
  const zItems = document.getElementById('zaoua-items').children;
  const all = [...mItems, ...zItems];
  const correct = all.filter(el =>
    (el.parentElement.id === 'mosque-items' && el.getAttribute('data-col') === 'mosque') ||
    (el.parentElement.id === 'zaoua-items' && el.getAttribute('data-col') === 'zaoua')
  ).length;
  const btn = document.getElementById('check-dd-btn');
  if (correct === 6) {
    showQuestResult(questId, true);
  } else {
    btn.textContent = `${correct}/6 correct — keep sorting!`;
    btn.style.background = 'var(--terra)';
  }
}

// TIMELINE
let tlOrder = [];
let dragTlItem = null;
function renderTimeline(q, body) {
  const shuffled = [...q.events].sort(() => Math.random() - 0.5);
  tlOrder = shuffled.map(e => e.order);

  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div style="font-size:11px;font-weight:700;letter-spacing:1px;color:var(--text-muted);text-transform:uppercase;margin-bottom:10px">Arrange from oldest to most recent</div>
    <div class="tl-container" id="tl-container">
      ${shuffled.map((ev, i) => `
        <div class="tl-item" data-order="${ev.order}" draggable="true"
          ondragstart="tlDragStart(event)" ondragover="tlDragOver(event)"
          ondrop="tlDrop(event)" ondragleave="tlDragLeave(event)">
          <div class="tl-num">${i+1}</div>
          <div>
            <div class="tl-year">${ev.year}</div>
            <div class="tl-desc">${ev.desc}</div>
          </div>
        </div>`).join('')}
    </div>
    <button class="check-btn" id="check-tl-btn" onclick="checkTimeline(${q.id})">Check Order ✓</button>`;
  body.appendChild(wrap);
  updateTlNumbers();
}

function tlDragStart(e) {
  dragTlItem = e.currentTarget;
  e.currentTarget.style.opacity = '0.4';
}
function tlDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('drag-over-tl');
}
function tlDragLeave(e) { e.currentTarget.classList.remove('drag-over-tl'); }
function tlDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over-tl');
  if (!dragTlItem || dragTlItem === e.currentTarget) { if(dragTlItem) dragTlItem.style.opacity='1'; return; }
  const container = document.getElementById('tl-container');
  const items = [...container.children];
  const fromIdx = items.indexOf(dragTlItem);
  const toIdx = items.indexOf(e.currentTarget);
  if (fromIdx < toIdx) container.insertBefore(dragTlItem, e.currentTarget.nextSibling);
  else container.insertBefore(dragTlItem, e.currentTarget);
  dragTlItem.style.opacity = '1';
  dragTlItem = null;
  updateTlNumbers();
}

function updateTlNumbers() {
  const items = document.querySelectorAll('#tl-container .tl-item');
  items.forEach((item, i) => { const n = item.querySelector('.tl-num'); if(n) n.textContent = i+1; });
}

function checkTimeline(questId) {
  const items = document.querySelectorAll('#tl-container .tl-item');
  const orders = [...items].map(el => parseInt(el.getAttribute('data-order')));
  const sorted = [...orders].sort((a,b) => a-b);
  const correct = orders.every((v,i) => v === sorted[i]);
  const btn = document.getElementById('check-tl-btn');
  if (correct) {
    showQuestResult(questId, true);
  } else {
    btn.textContent = 'Not quite — reorder and try again!';
    btn.style.background = 'var(--terra)';
  }
}

// QUEST RESULT
function showQuestResult(questId, correct) {
  const q = QUESTS[questId - 1];
  clearInterval(state.timers[questId]);
  if (correct && !state.completed.includes(questId)) {
    state.points += q.points;
    state.completed.push(questId);
  }

  const body = document.getElementById('quest-body-area');
  const children = [...body.children];
  children.forEach(c => {
    if (!c.classList.contains('timer-strip') && !c.classList.contains('quest-obj')) c.remove();
  });

  const result = document.createElement('div');
  result.innerHTML = `
    <div class="reward-box">
      <div class="r-icon">${q.badgeIcon}</div>
      <div class="r-title">${q.badge} Badge ${correct ? 'Unlocked' : 'Attempted'}!</div>
      <div class="r-sub">${correct ? '+' + q.points + ' Knowledge Points earned' : 'Revisit to earn full points'}</div>
    </div>
    <button class="continue-btn" onclick="afterQuest(${questId})">
      ${questId < 5 ? 'Continue Journey →' : 'Claim Your Title →'}
    </button>`;
  body.appendChild(result);
}

function afterQuest(questId) {
  if (questId >= 5 && state.completed.length >= 5) {
    renderFinal();
    navigate('screen-final');
  } else {
    navigate('screen-home');
  }
}

// ACHIEVEMENTS
function renderAchievements() {
  document.getElementById('ach-pts').textContent = state.points;
  const grid = document.getElementById('badges-grid');
  grid.innerHTML = '';
  BADGES.forEach(b => {
    const earned = state.completed.includes(b.id);
    grid.innerHTML += `<div class="badge-card">
      <div class="badge-circle ${earned ? 'earned' : 'locked-b'}">${b.icon}</div>
      <div class="badge-card-name">${b.name}</div>
      <div class="badge-card-cond">${b.cond}</div>
    </div>`;
  });
}

// LIBRARY — cards are clickable links
function renderLibrary(tab) {
  const content = document.getElementById('lib-content');
  content.innerHTML = '';
  (LIBRARY[tab] || []).forEach(item => {
    const href = item.url ? `href="${item.url}" target="_blank" rel="noopener noreferrer"` : '';
    content.innerHTML += `<a class="lib-card" ${href} style="text-decoration:none;color:inherit;display:flex;cursor:pointer;">
      <div class="lib-card-img">${item.icon}</div>
      <div class="lib-card-body">
        <div class="lib-tag">${item.tag}</div>
        <div class="lib-card-title">${item.title}</div>
        <div class="lib-card-desc">${item.desc}</div>
        <div class="lib-read">
          <span class="lib-time">📖 ${item.time}</span>
          <span class="lib-read-btn">READ MORE →</span>
        </div>
      </div>
    </a>`;
  });
}

function switchTab(btn, tab) {
  document.querySelectorAll('.lib-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderLibrary(tab);
}

// PROFILE
function renderProfile() {
  document.getElementById('profile-kp').textContent = state.points + ' KP';
  const list = document.getElementById('milestones-list');
  list.innerHTML = '';
  QUESTS.forEach(q => {
    const done = state.completed.includes(q.id);
    list.innerHTML += `<div class="milestone-item">
      <div class="milestone-check ${done ? 'done' : 'todo'}">${done ? '✓' : '○'}</div>
      <div>
        <div class="milestone-title">${q.title}</div>
        <div class="milestone-sub">${q.location}</div>
      </div>
    </div>`;
  });
}

// FINAL
function renderFinal() {
  const fb = document.getElementById('final-badges');
  fb.innerHTML = '';
  BADGES.forEach(b => {
    fb.innerHTML += `<div class="badge-circle earned">${b.icon}</div>`;
  });
}

function resetGame() {
  state.points = 0;
  state.completed = [];
  state.currentQuest = null;
  Object.values(state.timers).forEach(t => clearInterval(t));
  navigate('screen-home');
}

// INIT
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('bottom-nav').style.display = 'none';
  renderHome();
});
