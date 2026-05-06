# Elder Calculus 1132Q Grade Calculator

A clean, interactive grade calculator built for students in Professor Elder's Calculus II (MATH 1132Q) course at the University of Connecticut. Enter your scores and see your estimated course grade update in real time.

**Live site:** [milesluca14.github.io/ELDERGRADECALC](https://milesluca14.github.io/ELDERGRADECALC)

---

## What it does

- Sliders for every graded assignment — all 27 lecture questions, 22 WebAssign sections, and 10 discussion quizzes
- Automatically drops the lowest scores per Professor Elder's policy (6 LQ, 3 WA, 2 quizzes)
- Applies the Final Exam replacement logic — Parts 1 and 2 of the final can only raise your Exam 1 and Exam 2 grades, never lower them
- Displays your composite Final Exam grade alongside your full course grade and letter grade
- Full breakdown panel showing exactly how each category contributes to your total
- Dark and light mode, works on mobile

---

## Grade weights

| Category | Weight |
|---|---|
| Lecture Questions | 5% |
| WebAssign Homework | 10% |
| Discussion Quizzes | 20% |
| Exam 1 | 20% |
| Exam 2 | 20% |
| Final Exam | 25% |

---

## Drop policy

> "2 quiz scores, 3 WebAssign scores and 6 Lecture Question scores will be dropped." — Prof. Elder

Dropped scores are automatically identified and grayed out as you adjust sliders.

---

## Final Exam replacement logic

The final exam is split into three parts by unit. Parts 1 and 2 can improve your midterm grades:

```
Effective Exam 1 = max(Exam 1, average(Exam 1, Final Part 1))
Effective Exam 2 = max(Exam 2, average(Exam 2, Final Part 2))
```

Part 3 counts only toward the final exam composite. The final can never hurt your grade.

---

## Lecture Question scoring

Each lecture question is scored 0–2. The calculator averages the top 21 scores on the 0–2 scale, then normalizes to a percentage before applying the 5% weight.

---

## How to use

Just open the site and start moving sliders. No login, no data saved, no server — everything runs in your browser.

---

## Files

```
index.html   — page structure
style.css    — all styling, light and dark mode
calc.js      — all grade logic and slider behavior
```

---

## Built by

Miles Lucatorto · Spring 2026 · University of Connecticut
