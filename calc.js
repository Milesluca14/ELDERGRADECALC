/* ===================================================
   Elder Calculus 1132Q Grade Calculator — calc.js

   GRADE WEIGHTS (verified: sum = 1.00):
     Lecture Questions  →  5%  (0.05)
     WebAssign HW       → 10%  (0.10)
     Discussion Quizzes → 20%  (0.20)
     Exam 1             → 20%  (0.20)
     Exam 2             → 20%  (0.20)
     Final Exam         → 25%  (0.25)

   DROP POLICY:
     LQ    : 27 total, drop lowest 6,  average top 21
     WA    : 22 total, drop lowest 3,  average top 19
     Quizzes: 10 total, drop lowest 2, average top 8

   LQ SCORING:
     Each scored 0–2. Average kept scores on 0–2 scale,
     then normalize: (avg / 2) × 100 → percentage.

   FINAL REPLACEMENT:
     effectiveE1 = Math.max(e1, (e1 + f1) / 2)
     effectiveE2 = Math.max(e2, (e2 + f2) / 2)

   FINAL COMPOSITE (display + weight):
     composite = (f1 + f2 + f3) / 3

   COURSE GRADE:
     = lqNorm×0.05 + waAvg×0.10 + quizAvg×0.20
     + effectiveE1×0.20 + effectiveE2×0.20
     + composite×0.25

   LETTER SCALE:
     A  91–100 | A- 89–90 | B+ 87–88 | B  81–86
     B- 79–80  | C+ 77–78 | C  71–76 | C- 69–70
     D+ 67–68  | D  61–66 | D- 59–60 | F  <59
   =================================================== */

'use strict';

/* ---- DATA ---- */
const LQ_DATES = [
  '1/20','1/22','1/27','1/29',
  '2/3','2/5','2/10','2/12',
  '2/17','2/19','2/24','2/26',
  '3/3','3/5','3/10','3/12',
  '3/24','3/26','3/31',
  '4/2','4/7','4/9',
  '4/14','4/16','4/21','4/23','4/28'
];
const LQ_TOTAL = 27, LQ_DROP = 6, LQ_KEEP = 21;

const WA_SECTIONS = [
  '7.1','7.3','7.4','7.7','7.8',
  '6.4',
  '11.1','11.2','11.3','11.4','11.5','11.6','11.8','11.9','11.10','11.11',
  '9.3','8.1',
  '10.1','10.2','10.3','10.4'
];
const WA_TOTAL = 22, WA_DROP = 3, WA_KEEP = 19;

const QUIZ_TOTAL = 10, QUIZ_DROP = 2, QUIZ_KEEP = 8;

/* ---- HELPERS ---- */
function avg(arr) {
  if (!arr.length) return 0;
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

function dropLowest(items, nDrop) {
  // items: array of { id, val }
  const sorted = [...items].sort((a, b) => a.val - b.val);
  const droppedIds = new Set(sorted.slice(0, nDrop).map(x => x.id));
  return {
    kept:       items.filter(x => !droppedIds.has(x.id)),
    droppedIds
  };
}

function letterGrade(s) {
  if (s >= 91) return 'A';
  if (s >= 89) return 'A-';
  if (s >= 87) return 'B+';
  if (s >= 81) return 'B';
  if (s >= 79) return 'B-';
  if (s >= 77) return 'C+';
  if (s >= 71) return 'C';
  if (s >= 69) return 'C-';
  if (s >= 67) return 'D+';
  if (s >= 61) return 'D';
  if (s >= 59) return 'D-';
  return 'F';
}

function gradeClass(letter) {
  const c = letter[0];
  if (c === 'A') return 'A';
  if (c === 'B') return 'B';
  if (c === 'C') return 'C';
  if (c === 'D') return 'D';
  return 'F';
}

/* ---- SLIDER BUILDER ---- */
function makeSlider({ containerId, items, idPrefix, min, max, defaultVal, labelFn, onInput }) {
  const container = document.getElementById(containerId);
  items.forEach((item, i) => {
    const id = `${idPrefix}${i}`;
    const div = document.createElement('div');
    div.className = 'slider-item';
    div.id = `${idPrefix}-item-${i}`;
    div.innerHTML = `
      <div class="slider-top">
        <span class="slider-label">${labelFn(item, i)}</span>
        <div class="slider-right">
          <span class="dropped-tag" id="${idPrefix}-dtag-${i}" style="display:none">dropped</span>
          <span class="slider-num" id="${id}-val">${defaultVal}</span>
        </div>
      </div>
      <input class="big-slider" type="range" min="${min}" max="${max}" step="1" value="${defaultVal}" id="${id}" />
      <div class="slider-ends"><span>${min}</span><span>${max}</span></div>
    `;
    container.appendChild(div);
    document.getElementById(id).addEventListener('input', () => {
      document.getElementById(`${id}-val`).textContent = document.getElementById(id).value;
      onInput();
    });
  });
}

function getSliderValues(idPrefix, count) {
  return Array.from({ length: count }, (_, i) => ({
    id:  i,
    val: parseFloat(document.getElementById(`${idPrefix}${i}`).value)
  }));
}

function applyDropStyling(idPrefix, count, droppedIds) {
  for (let i = 0; i < count; i++) {
    const item = document.getElementById(`${idPrefix}-item-${i}`);
    const dtag = document.getElementById(`${idPrefix}-dtag-${i}`);
    if (droppedIds.has(i)) {
      item.classList.add('dropped');
      dtag.style.display = 'inline-block';
    } else {
      item.classList.remove('dropped');
      dtag.style.display = 'none';
    }
  }
}

/* ---- MAIN CALC ---- */
function recalc() {

  /* 1. LECTURE QUESTIONS */
  const lqItems  = getSliderValues('lq', LQ_TOTAL);
  const lqResult = dropLowest(lqItems, LQ_DROP);
  applyDropStyling('lq', LQ_TOTAL, lqResult.droppedIds);

  // avg on 0–2 scale, then normalize to 0–100
  const lqRawAvg    = avg(lqResult.kept.map(x => x.val));  // 0 to 2
  const lqNorm      = (lqRawAvg / 2) * 100;                // 0 to 100

  /* 2. WEBASSIGN */
  const waItems  = getSliderValues('wa', WA_TOTAL);
  const waResult = dropLowest(waItems, WA_DROP);
  applyDropStyling('wa', WA_TOTAL, waResult.droppedIds);

  const waAvg = avg(waResult.kept.map(x => x.val));  // 0 to 100

  /* 3. QUIZZES */
  const qzItems  = getSliderValues('qz', QUIZ_TOTAL);
  const qzResult = dropLowest(qzItems, QUIZ_DROP);
  applyDropStyling('qz', QUIZ_TOTAL, qzResult.droppedIds);

  const qzAvg = avg(qzResult.kept.map(x => x.val));  // 0 to 100

  /* 4. EXAMS */
  const e1Raw = parseFloat(document.getElementById('e1').value);
  const e2Raw = parseFloat(document.getElementById('e2').value);

  /* 5. FINAL */
  const f1 = parseFloat(document.getElementById('f1').value);
  const f2 = parseFloat(document.getElementById('f2').value);
  const f3 = parseFloat(document.getElementById('f3').value);

  /* 6. REPLACEMENT LOGIC */
  // effectiveExam = max(examRaw, (examRaw + finalPart) / 2)
  // The final can only help, never hurt.
  const e1Eff = Math.max(e1Raw, (e1Raw + f1) / 2);
  const e2Eff = Math.max(e2Raw, (e2Raw + f2) / 2);

  const e1Boosted = e1Eff > e1Raw;
  const e2Boosted = e2Eff > e2Raw;

  document.getElementById('e1-badge').classList.toggle('on', e1Boosted);
  document.getElementById('e2-badge').classList.toggle('on', e2Boosted);

  /* 7. FINAL COMPOSITE (display + course grade weight) */
  const finalComp = (f1 + f2 + f3) / 3;
  document.getElementById('final-composite').textContent = finalComp.toFixed(1);

  /* 8. COURSE GRADE */
  const lqContrib   = lqNorm   * 0.05;
  const waContrib   = waAvg    * 0.10;
  const qzContrib   = qzAvg    * 0.20;
  const e1Contrib   = e1Eff    * 0.20;
  const e2Contrib   = e2Eff    * 0.20;
  const finContrib  = finalComp * 0.25;

  const course = lqContrib + waContrib + qzContrib + e1Contrib + e2Contrib + finContrib;

  /* 9. LETTER */
  const letter = letterGrade(course);
  const cls    = gradeClass(letter);

  /* 10. UPDATE UI */
  const courseEl = document.getElementById('course-grade');
  courseEl.textContent = course.toFixed(2) + '%';
  courseEl.className   = `rc-value ${cls}`;

  const letterEl = document.getElementById('letter-grade');
  letterEl.textContent = letter;
  letterEl.className   = `rc-value ${cls}`;

  // Sticky bar
  document.getElementById('sticky-score').textContent  = course.toFixed(2) + '%';
  document.getElementById('sticky-letter').textContent = letter;

  /* 11. BREAKDOWN */
  document.getElementById('breakdown').innerHTML = `
    <div class="bd-item">
      <span class="bd-cat">Lecture Questions</span>
      <span class="bd-detail">top ${LQ_KEEP}/${LQ_TOTAL} · avg ${lqRawAvg.toFixed(3)}/2 → ${lqNorm.toFixed(2)}%</span>
      <span class="bd-contrib">+${lqContrib.toFixed(4)} pts</span>
    </div>
    <div class="bd-item">
      <span class="bd-cat">WebAssign</span>
      <span class="bd-detail">top ${WA_KEEP}/${WA_TOTAL} · avg ${waAvg.toFixed(2)}%</span>
      <span class="bd-contrib">+${waContrib.toFixed(4)} pts</span>
    </div>
    <div class="bd-item">
      <span class="bd-cat">Quizzes</span>
      <span class="bd-detail">top ${QUIZ_KEEP}/${QUIZ_TOTAL} · avg ${qzAvg.toFixed(2)}%</span>
      <span class="bd-contrib">+${qzContrib.toFixed(4)} pts</span>
    </div>
    <div class="bd-item">
      <span class="bd-cat">Exam 1</span>
      <span class="bd-detail">raw ${e1Raw}${e1Boosted ? ` → effective ${e1Eff.toFixed(2)}` : ''}</span>
      <span class="bd-contrib">+${e1Contrib.toFixed(4)} pts</span>
    </div>
    <div class="bd-item">
      <span class="bd-cat">Exam 2</span>
      <span class="bd-detail">raw ${e2Raw}${e2Boosted ? ` → effective ${e2Eff.toFixed(2)}` : ''}</span>
      <span class="bd-contrib">+${e2Contrib.toFixed(4)} pts</span>
    </div>
    <div class="bd-item">
      <span class="bd-cat">Final Exam</span>
      <span class="bd-detail">composite ${finalComp.toFixed(2)}% (${f1}+${f2}+${f3})/3</span>
      <span class="bd-contrib">+${finContrib.toFixed(4)} pts</span>
    </div>
    <div class="bd-item">
      <span class="bd-cat">Total</span>
      <span class="bd-detail">${lqContrib.toFixed(3)}+${waContrib.toFixed(3)}+${qzContrib.toFixed(3)}+${e1Contrib.toFixed(3)}+${e2Contrib.toFixed(3)}+${finContrib.toFixed(3)}</span>
      <span class="bd-contrib">${course.toFixed(4)}%</span>
    </div>
  `;
}

/* ---- INIT ---- */
document.addEventListener('DOMContentLoaded', () => {

  // Build LQ sliders
  makeSlider({
    containerId: 'lq-sliders',
    items:       LQ_DATES,
    idPrefix:    'lq',
    min: 0, max: 2, defaultVal: 2,
    labelFn: (date) => date,
    onInput: recalc
  });

  // Build WA sliders
  makeSlider({
    containerId: 'wa-sliders',
    items:       WA_SECTIONS,
    idPrefix:    'wa',
    min: 0, max: 100, defaultVal: 85,
    labelFn: (sec) => `Section ${sec}`,
    onInput: recalc
  });

  // Build Quiz sliders
  makeSlider({
    containerId: 'quiz-sliders',
    items:       Array.from({ length: QUIZ_TOTAL }, (_, i) => i + 1),
    idPrefix:    'qz',
    min: 0, max: 100, defaultVal: 80,
    labelFn: (_, i) => `Quiz ${i + 1}`,
    onInput: recalc
  });

  // Wire exam and final sliders
  ['e1','e2','f1','f2','f3'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      document.getElementById(`${id}-val`).textContent = document.getElementById(id).value;
      recalc();
    });
  });

  // Set all buttons
  document.getElementById('btn-lq-all').addEventListener('click', () => {
    for (let i = 0; i < LQ_TOTAL; i++) {
      document.getElementById(`lq${i}`).value = 2;
      document.getElementById(`lq${i}-val`).textContent = '2';
    }
    recalc();
  });

  document.getElementById('btn-wa-all').addEventListener('click', () => {
    for (let i = 0; i < WA_TOTAL; i++) {
      document.getElementById(`wa${i}`).value = 100;
      document.getElementById(`wa${i}-val`).textContent = '100';
    }
    recalc();
  });

  // Dark/light toggle
  const toggle = document.getElementById('theme-toggle');
  const moon   = document.getElementById('icon-moon');
  const sun    = document.getElementById('icon-sun');

  toggle.addEventListener('click', () => {
    const html    = document.documentElement;
    const isDark  = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    moon.style.display = isDark ? 'block' : 'none';
    sun.style.display  = isDark ? 'none'  : 'block';
  });

  // Respect system preference on load
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
    moon.style.display = 'none';
    sun.style.display  = 'block';
  }

  recalc();
});
