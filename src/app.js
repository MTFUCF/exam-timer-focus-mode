const STORAGE_KEY = 'exam-timer-focus-mode.history';
const letters = ['A', 'B', 'C', 'D'];
const screens = {
  welcome: document.getElementById('welcomeScreen'),
  exam: document.getElementById('examScreen'),
  review: document.getElementById('reviewScreen')
};
const elements = {
  setupForm: document.getElementById('setupForm'),
  historyList: document.getElementById('historyList'),
  timerDisplay: document.getElementById('timerDisplay'),
  pauseIndicator: document.getElementById('pauseIndicator'),
  pauseButton: document.getElementById('pauseButton'),
  submitButton: document.getElementById('submitButton'),
  questionNumber: document.getElementById('questionNumber'),
  questionTotal: document.getElementById('questionTotal'),
  domainBadge: document.getElementById('domainBadge'),
  questionText: document.getElementById('questionText'),
  choicesForm: document.getElementById('choicesForm'),
  previousButton: document.getElementById('previousButton'),
  nextButton: document.getElementById('nextButton'),
  flagButton: document.getElementById('flagButton'),
  questionIndexBar: document.getElementById('questionIndexBar'),
  scoreHeading: document.getElementById('scoreHeading'),
  scoreMeta: document.getElementById('scoreMeta'),
  domainBreakdown: document.getElementById('domainBreakdown'),
  incorrectList: document.getElementById('incorrectList'),
  restartButton: document.getElementById('restartButton'),
  submitDialog: document.getElementById('submitDialog'),
  submitSummary: document.getElementById('submitSummary'),
  confirmSubmitButton: document.getElementById('confirmSubmitButton'),
  focusToggle: document.getElementById('focusToggle'),
  fullscreenToggle: document.getElementById('fullscreenToggle')
};
let bank = [];
let timerId = null;
let state = idleState();
function idleState() {
  return { exam: 'SC-900', durationMinutes: 45, questionCount: 15, questions: [], answers: {}, flagged: new Set(), currentIndex: 0, remainingSeconds: 0, paused: false, submitted: false, pauseReason: '' };
}
async function init() {
  const response = await fetch('data/exam-questions.json');
  const payload = await response.json();
  bank = payload.questions || [];
  renderHistory();
  wireEvents();
}
function wireEvents() {
  elements.setupForm.addEventListener('submit', startExam);
  elements.previousButton.addEventListener('click', () => goToQuestion(state.currentIndex - 1));
  elements.nextButton.addEventListener('click', () => goToQuestion(state.currentIndex + 1));
  elements.flagButton.addEventListener('click', toggleFlag);
  elements.pauseButton.addEventListener('click', () => togglePause());
  elements.submitButton.addEventListener('click', openSubmitDialog);
  elements.confirmSubmitButton.addEventListener('click', () => submitExam('manual'));
  elements.restartButton.addEventListener('click', resetToWelcome);
  elements.focusToggle.addEventListener('click', () => document.body.classList.toggle('focus-mode'));
  elements.fullscreenToggle.addEventListener('click', toggleFullscreen);
  document.addEventListener('keydown', onKeydown);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && state.questions.length && !state.submitted) togglePause(true, 'tab');
  });
}
function startExam(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const exam = form.get('exam') || 'SC-900';
  const durationMinutes = Number(form.get('duration')) || 45;
  const questionCount = Number(form.get('questionCount')) || 15;
  const available = bank.filter((item) => item.exam === exam);
  if (!available.length) return;
  state = { exam, durationMinutes, questionCount, questions: buildQuestionSet(available, questionCount), answers: {}, flagged: new Set(), currentIndex: 0, remainingSeconds: durationMinutes * 60, paused: false, submitted: false, pauseReason: '' };
  document.body.classList.add('exam-active', 'focus-mode');
  showScreen('exam');
  renderExam();
  startTimer();
}
function buildQuestionSet(available, count) {
  const copy = shuffle([...available]);
  const set = [];
  while (set.length < count) {
    const next = copy[set.length % copy.length];
    set.push({ ...next, id: `${next.id}-${set.length + 1}` });
    if ((set.length % copy.length) === 0) shuffle(copy);
  }
  return set;
}
function showScreen(name) { Object.entries(screens).forEach(([key, node]) => node.classList.toggle('hidden', key !== name)); }
function startTimer() {
  clearInterval(timerId);
  timerId = window.setInterval(() => {
    if (state.paused || state.submitted) return;
    state.remainingSeconds = Math.max(0, state.remainingSeconds - 1);
    renderTimer();
    if (state.remainingSeconds === 0) submitExam('timer');
  }, 1000);
  renderTimer();
}
function renderTimer() {
  const minutes = String(Math.floor(state.remainingSeconds / 60)).padStart(2, '0');
  const seconds = String(state.remainingSeconds % 60).padStart(2, '0');
  elements.timerDisplay.textContent = `${minutes}:${seconds}`;
}
function renderExam() {
  renderQuestion();
  renderIndex();
  updatePauseUi();
  renderTimer();
}
function renderQuestion() {
  const question = state.questions[state.currentIndex];
  const selected = state.answers[question.id];
  elements.questionNumber.textContent = String(state.currentIndex + 1);
  elements.questionTotal.textContent = String(state.questions.length);
  elements.domainBadge.textContent = question.domain;
  elements.questionText.textContent = question.question;
  elements.flagButton.textContent = state.flagged.has(question.id) ? 'Flagged for review' : 'Flag for review';
  elements.previousButton.disabled = state.currentIndex === 0;
  elements.choicesForm.innerHTML = question.choices.map((choice, index) => `
    <label class="choice-option ${selected === index ? 'selected' : ''}">
      <input type="radio" name="answer" value="${index}" ${selected === index ? 'checked' : ''} />
      <span>${letters[index]}</span>
      <span>${choice}</span>
    </label>`).join('');
  elements.choicesForm.querySelectorAll('input').forEach((input) => input.addEventListener('change', () => {
    state.answers[question.id] = Number(input.value);
    renderQuestion();
    renderIndex();
  }));
}
function renderIndex() {
  elements.questionIndexBar.innerHTML = state.questions.map((question, index) => {
    const classes = ['index-button'];
    if (typeof state.answers[question.id] === 'number') classes.push('answered');
    if (state.flagged.has(question.id)) classes.push('flagged');
    if (index === state.currentIndex) classes.push('current');
    return `<button class="${classes.join(' ')}" type="button" data-index="${index}">${index + 1}</button>`;
  }).join('');
  elements.questionIndexBar.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => goToQuestion(Number(button.dataset.index))));
}
function goToQuestion(index) { if (index < 0 || index >= state.questions.length) return; state.currentIndex = index; renderQuestion(); renderIndex(); }
function toggleFlag() {
  const id = state.questions[state.currentIndex].id;
  if (state.flagged.has(id)) state.flagged.delete(id); else state.flagged.add(id);
  renderQuestion();
  renderIndex();
}
function togglePause(force = null, reason = '') {
  if (!state.questions.length || state.submitted) return;
  state.paused = force === null ? !state.paused : force;
  state.pauseReason = state.paused ? (reason || state.pauseReason || 'manual') : '';
  updatePauseUi();
}
function updatePauseUi() {
  elements.pauseIndicator.classList.toggle('hidden', !(state.paused && state.pauseReason === 'tab'));
  elements.pauseButton.textContent = state.paused ? 'Resume' : 'Pause';
}
function openSubmitDialog() {
  const unanswered = state.questions.filter((question) => typeof state.answers[question.id] !== 'number').length;
  const flagged = state.flagged.size;
  if (unanswered === 0 && flagged === 0) return submitExam('manual');
  elements.submitSummary.textContent = `You still have ${unanswered} unanswered and ${flagged} flagged question(s).`;
  elements.submitDialog.showModal();
}
function submitExam(reason) {
  if (state.submitted) return;
  state.submitted = true;
  clearInterval(timerId);
  if (elements.submitDialog.open) elements.submitDialog.close();
  document.body.classList.remove('exam-active', 'focus-mode');
  const results = buildResults();
  saveHistory(results);
  renderReview(results, reason);
  showScreen('review');
}
function buildResults() {
  const totalsByDomain = {};
  const correctByDomain = {};
  const incorrect = [];
  let correctCount = 0;
  state.questions.forEach((question) => {
    totalsByDomain[question.domain] = (totalsByDomain[question.domain] || 0) + 1;
    const selected = state.answers[question.id];
    if (selected === question.correctAnswer) {
      correctByDomain[question.domain] = (correctByDomain[question.domain] || 0) + 1;
      correctCount += 1;
      return;
    }
    incorrect.push({ ...question, selected });
  });
  return { score: Math.round((correctCount / state.questions.length) * 100), correctCount, total: state.questions.length, totalsByDomain, correctByDomain, incorrect, durationMinutes: state.durationMinutes, questionCount: state.questionCount, exam: state.exam };
}
function renderReview(results, reason) {
  elements.scoreHeading.textContent = `Score: ${results.score}%`;
  elements.scoreMeta.textContent = `${results.correctCount} correct out of ${results.total} · ${reason === 'timer' ? 'auto-submitted when time expired' : 'submitted for review'}`;
  elements.domainBreakdown.innerHTML = Object.keys(results.totalsByDomain).map((domain) => {
    const total = results.totalsByDomain[domain];
    const correct = results.correctByDomain[domain] || 0;
    return `<article class="domain-card"><strong>${domain}</strong><span>${correct}/${total} correct</span><p class="subtle">${Math.round((correct / total) * 100)}%</p></article>`;
  }).join('');
  elements.incorrectList.innerHTML = results.incorrect.length ? results.incorrect.map((question) => {
    const selected = typeof question.selected === 'number' ? `${letters[question.selected]} · ${question.choices[question.selected]}` : 'No answer selected';
    return `<article class="incorrect-card"><p class="eyebrow">${question.domain}</p><strong>${question.question}</strong><p><strong>Your answer:</strong> ${selected}</p><p><strong>Correct answer:</strong> ${letters[question.correctAnswer]} · ${question.choices[question.correctAnswer]}</p><p><strong>Rationale:</strong> ${question.rationale}</p><p><a href="${question.sourceUrl}" target="_blank" rel="noreferrer">Open Microsoft Learn source</a></p></article>`;
  }).join('') : '<article class="incorrect-card"><strong>Great work.</strong><p>You answered every question correctly in this attempt.</p></article>';
}
function saveHistory(results) {
  const history = readHistory();
  history.unshift({ date: new Date().toLocaleString(), score: results.score, duration: results.durationMinutes, questionCount: results.questionCount, exam: results.exam });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 8)));
  renderHistory();
}
function renderHistory() {
  const history = readHistory();
  elements.historyList.innerHTML = history.length ? history.map((item) => `<li><strong>${item.score}%</strong><div class="subtle">${item.exam} · ${item.questionCount} questions · ${item.duration} minutes</div><div class="small-text subtle">${item.date}</div></li>`).join('') : '<li>No saved attempts yet. Start with a 15-question warm-up.</li>';
}
function readHistory() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; } }
function resetToWelcome() { clearInterval(timerId); state = idleState(); showScreen('welcome'); }
function onKeydown(event) {
  if (!state.questions.length || state.submitted || event.repeat) return;
  const key = event.key.toLowerCase();
  if (['1', '2', '3', '4'].includes(key)) selectAnswer(Number(key) - 1);
  if (['a', 'b', 'c', 'd'].includes(key)) selectAnswer(letters.indexOf(key.toUpperCase()));
  if (event.code === 'Space') { event.preventDefault(); toggleFlag(); }
  if (event.key === 'Enter') { event.preventDefault(); goToQuestion(Math.min(state.currentIndex + 1, state.questions.length - 1)); }
  if (event.key === 'Escape') { event.preventDefault(); togglePause(); }
}
function selectAnswer(index) {
  const question = state.questions[state.currentIndex];
  if (index < 0 || index >= question.choices.length) return;
  state.answers[question.id] = index;
  renderQuestion();
  renderIndex();
}
async function toggleFullscreen() {
  if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen();
}
function shuffle(items) { for (let i = items.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [items[i], items[j]] = [items[j], items[i]]; } return items; }
init();
