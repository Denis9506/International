const vocabData = [
  { "en": "mutually interlinked", "uk": "взаємопов'язані" },
  { "en": "shrunk", "uk": "зменшуватися" },
  { "en": "have an immediate impact on", "uk": "мати безпосередній вплив на" },
  { "en": "maintain regular relations", "uk": "підтримувати регулярні відносини" },
  { "en": "security matters", "uk": "питання безпеки" },
  { "en": "brought the states together", "uk": "об'єднуватися" },
  { "en": "yielded", "uk": "поступатися" },
  { "en": "treaties", "uk": "договори" },
  { "en": "be traced", "uk": "простежуватися в" },
  { "en": "utilized", "uk": "бути використаним" },
  { "en": "disintegration", "uk": "розпад" },
  { "en": "North Atlantic Treaty Organization (NATO)", "uk": "Організація Північноатлантичного договору (НАТО)" },
  { "en": "emergence", "uk": "поява" },
  { "en": "to great extent", "uk": "значною мірою" },
  { "en": "interactions between", "uk": "взаємодії між" },
  { "en": "United Nations (UN)", "uk": "Організація Об'єднаних Націй (ООН)" },
  { "en": "variables", "uk": "змінні" },
  { "en": "are shaped", "uk": "формуються" },
  { "en": "private citizens", "uk": "приватні громадяни" },
  { "en": "nongovernmental organizations", "uk": "неурядові організації" },
  { "en": "affected by", "uk": "зазнавати впливу" },
  { "en": "domestic political events", "uk": "внутрішньополітичні події" },
  { "en": "are guided", "uk": "керуються" },
  { "en": "the interstate system", "uk": "міждержавна система" },
  { "en": "convened", "uk": "скликаний" },
  { "en": "the defeat", "uk": "поразка" },
  { "en": "centered mainly on", "uk": "зосереджено переважно на" },
  { "en": "security studies", "uk": "безпека" },
  { "en": "relate to", "uk": "ставитися до" },
  { "en": "alliances", "uk": "альянси; союзи" },
  { "en": "World Bank", "uk": "Світовий банк" },
  { "en": "International Monetary Fund", "uk": "Міжнародний валютний фонд" },
  { "en": "strive", "uk": "прагнути" },
  { "en": "depart", "uk": "різнитися" },
  { "en": "to peacefully resolve", "uk": "вирішувати мирним шляхом" },
  { "en": "parties", "uk": "сторони" },
  { "en": "conflicts often escalate into", "uk": "конфлікти переростають" },
  { "en": "coercion", "uk": "насилля" },
  { "en": "Thus", "uk": "таким чином" },
  { "en": "the authorized leaders", "uk": "уповноважені керівники" },
  { "en": "fall in the domain", "uk": "потрапляти у сферу" },
  { "en": "intercourse among", "uk": "відносини між" },
  { "en": "the national frontiers", "uk": "національні кордони" },
  { "en": "traversing state boundaries", "uk": "перетин державних кордонів" },
  { "en": "a state boundary", "uk": "державний кордон" },
  { "en": "superpowers", "uk": "наддержави" },
  { "en": "bipolarity", "uk": "біполярність" },
  { "en": "flourishing", "uk": "процвітати" },
  { "en": "peace", "uk": "миролюбні держави" },
  { "en": "Charter", "uk": "Статут ООН" },
  { "en": "The Gulf War", "uk": "Війна в Перській затоці" },
  { "en": "paved the way for", "uk": "прокласти шлях для" },
  { "en": "resulted in", "uk": "в результаті; призвело до" },
  { "en": "Due to", "uk": "через те, що; завдяки" },
  { "en": "a global village", "uk": "глобальне село" },
  { "en": "scattered", "uk": "розсіяний" }
];

/* ---------- Tabs ---------- */

const tabs = [...document.querySelectorAll('.tab')];
const indicator = document.getElementById('tab-indicator');
const panels = {
  list: document.getElementById('panel-list'),
  quiz: document.getElementById('panel-quiz')
};

let activeTabIndex = 0;

function moveIndicator() {
  const tab = tabs[activeTabIndex];
  const tabRect = tab.getBoundingClientRect();
  const navRect = tab.parentElement.getBoundingClientRect();
  indicator.style.width = `${tabRect.width}px`;
  indicator.style.transform = `translateX(${tabRect.left - navRect.left}px)`;
}

function selectTab(index) {
  if (index === activeTabIndex) return;
  const forward = index > activeTabIndex;
  activeTabIndex = index;

  tabs.forEach((t, i) => {
    const active = i === index;
    t.classList.toggle('active', active);
    t.setAttribute('aria-selected', String(active));
  });

  moveIndicator();

  Object.entries(panels).forEach(([name, panel]) => {
    const active = name === tabs[index].dataset.tab;
    panel.classList.remove('slide-in-left', 'slide-in-right');
    panel.classList.toggle('active', active);
    if (active) {
      void panel.offsetWidth; // restart the animation
      panel.classList.add(forward ? 'slide-in-right' : 'slide-in-left');
    }
  });
}

tabs.forEach((tab, i) => tab.addEventListener('click', () => selectTab(i)));
window.addEventListener('resize', moveIndicator);
moveIndicator();

/* ---------- Vocabulary list ---------- */

const tbody = document.querySelector('#vocab-table tbody');
const noResults = document.getElementById('no-results');
const search = document.getElementById('search');

function renderTable(filter = '') {
  const q = filter.trim().toLowerCase();
  const rows = vocabData
    .map((item, i) => ({ ...item, n: i + 1 }))
    .filter(item => !q || item.en.toLowerCase().includes(q) || item.uk.toLowerCase().includes(q));

  tbody.replaceChildren(...rows.map(item => {
    const tr = document.createElement('tr');
    [item.n, item.en, item.uk].forEach(value => {
      const td = document.createElement('td');
      td.textContent = value;
      tr.appendChild(td);
    });
    return tr;
  }));

  noResults.hidden = rows.length > 0;
}

search.addEventListener('input', () => renderTable(search.value));
renderTable();

/* ---------- Quiz ---------- */

const modal = document.getElementById('modal');
const modalFoot = document.getElementById('modal-foot');
const modalStats = document.getElementById('modal-stats');
const progressBar = document.querySelector('.progress-bar');
const progressFill = document.getElementById('progress-fill');
const closeBtn = document.getElementById('close-btn');

const quizArea = document.getElementById('quiz-area');
const resultEl = document.getElementById('result');

const directionEl = document.getElementById('direction');
const countRange = document.getElementById('count-range');
const countValue = document.getElementById('count-value');
const optionsRange = document.getElementById('options-range');
const optionsValue = document.getElementById('options-value');
const startBtn = document.getElementById('start-btn');

const promptLabel = document.getElementById('prompt-label');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const feedbackEl = document.getElementById('feedback');
const nextBtn = document.getElementById('next-btn');
const scoreEl = document.getElementById('score');
const progressEl = document.getElementById('progress');
const againBtn = document.getElementById('again-btn');
const settingsBtn = document.getElementById('settings-btn');
const resultScore = document.getElementById('result-score');
const resultTitle = document.getElementById('result-title');
const resultEmoji = document.getElementById('result-emoji');

const settings = { direction: 'en', count: 10, options: 4 };

let queue = [];
let current = null;
let questionIndex = 0;
let correctCount = 0;

countRange.max = String(vocabData.length);
countRange.addEventListener('input', () => {
  settings.count = Number(countRange.value);
  countValue.textContent = settings.count;
});

optionsRange.addEventListener('input', () => {
  settings.options = Number(optionsRange.value);
  optionsValue.textContent = settings.options;
});

directionEl.addEventListener('click', event => {
  const btn = event.target.closest('.seg');
  if (!btn) return;
  settings.direction = btn.dataset.dir;
  directionEl.querySelectorAll('.seg').forEach(b => {
    const active = b === btn;
    b.classList.toggle('active', active);
    b.setAttribute('aria-checked', String(active));
  });
});

const randomInt = max => Math.floor(Math.random() * max);

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestion(pair) {
  const askEnglish = settings.direction === 'mix'
    ? Math.random() < 0.5
    : settings.direction === 'en';

  const promptKey = askEnglish ? 'en' : 'uk';
  const answerKey = askEnglish ? 'uk' : 'en';
  const answer = pair[answerKey];

  const pool = shuffle(vocabData.map(item => item[answerKey]).filter(v => v !== answer));
  const distractors = [];
  const used = new Set();
  for (const candidate of pool) {
    if (distractors.length >= settings.options - 1) break;
    if (used.has(candidate)) continue;
    used.add(candidate);
    distractors.push(candidate);
  }

  return {
    prompt: pair[promptKey],
    answer,
    options: shuffle([answer, ...distractors]),
    label: askEnglish ? 'Choose the Ukrainian translation' : 'Choose the English translation'
  };
}

/* --- Modal handling --- */

let lastFocused = null;

function openModal() {
  lastFocused = document.activeElement;
  modal.classList.remove('closing');
  modal.hidden = false;
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onModalKeydown);
  closeBtn.focus();
}

function closeModal() {
  if (modal.hidden || modal.classList.contains('closing')) return;

  modal.classList.add('closing');
  const finish = () => {
    if (modal.hidden) return;
    modal.classList.remove('closing');
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    if (lastFocused) lastFocused.focus();
  };

  const dialog = modal.querySelector('.modal');
  dialog.addEventListener('animationend', finish, { once: true });
  setTimeout(finish, 400); // fallback if the animation never fires

  document.removeEventListener('keydown', onModalKeydown);
}

function onModalKeydown(event) {
  if (event.key === 'Escape') {
    closeModal();
    return;
  }
  if (event.key !== 'Tab') return;

  const focusable = [...modal.querySelectorAll('button:not([disabled])')]
    .filter(el => el.offsetParent !== null);
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

closeBtn.addEventListener('click', closeModal);
modal.addEventListener('mousedown', event => {
  if (event.target === modal) closeModal();
});

/* --- Quiz flow --- */

function showQuizView(name) {
  const inQuiz = name === 'quiz';
  quizArea.hidden = !inQuiz;
  resultEl.hidden = inQuiz;
  modalFoot.hidden = !inQuiz;
  modalStats.hidden = !inQuiz;
  progressBar.hidden = !inQuiz;
}

function updateStats() {
  scoreEl.textContent = `Score: ${correctCount} / ${questionIndex}`;
  progressEl.textContent = `Question ${Math.min(questionIndex + 1, queue.length)} / ${queue.length}`;
  progressFill.style.width = `${(questionIndex / queue.length) * 100}%`;
}

function startQuiz() {
  queue = shuffle(vocabData).slice(0, settings.count);
  questionIndex = 0;
  correctCount = 0;
  showQuizView('quiz');
  renderQuestion();
  openModal();
}

function renderQuestion() {
  current = buildQuestion(queue[questionIndex]);
  updateStats();
  promptLabel.textContent = current.label;
  questionEl.textContent = current.prompt;
  feedbackEl.textContent = '';
  feedbackEl.className = 'feedback';
  nextBtn.hidden = true;

  optionsEl.replaceChildren(...current.options.map(text => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'option';
    btn.textContent = text;
    btn.addEventListener('click', () => handleAnswer(btn, text));
    return btn;
  }));
}

function handleAnswer(button, value) {
  optionsEl.querySelectorAll('.option').forEach(b => {
    b.disabled = true;
    if (b.textContent === current.answer) b.classList.add('correct');
  });

  const isCorrect = value === current.answer;
  if (isCorrect) {
    correctCount++;
    feedbackEl.textContent = 'Correct!';
    feedbackEl.className = 'feedback ok';
  } else {
    button.classList.remove('correct');
    button.classList.add('wrong');
    feedbackEl.textContent = `Incorrect — correct answer: ${current.answer}`;
    feedbackEl.className = 'feedback bad';
  }

  questionIndex++;
  scoreEl.textContent = `Score: ${correctCount} / ${questionIndex}`;
  progressFill.style.width = `${(questionIndex / queue.length) * 100}%`;

  const isLast = questionIndex >= queue.length;
  nextBtn.textContent = isLast ? 'See results' : 'Next Question';
  nextBtn.hidden = false;
  nextBtn.focus();
}

function showResults() {
  const percent = Math.round((correctCount / queue.length) * 100);
  resultScore.textContent = `${correctCount} / ${queue.length} (${percent}%)`;
  resultTitle.textContent = percent >= 80 ? 'Excellent!' : percent >= 50 ? 'Good job!' : 'Keep practising!';
  resultEmoji.textContent = percent >= 80 ? '🎉' : percent >= 50 ? '👍' : '📚';
  showQuizView('result');
  againBtn.focus();
}

nextBtn.addEventListener('click', () => {
  if (questionIndex >= queue.length) showResults();
  else renderQuestion();
});

startBtn.addEventListener('click', startQuiz);
againBtn.addEventListener('click', startQuiz);
settingsBtn.addEventListener('click', closeModal);
