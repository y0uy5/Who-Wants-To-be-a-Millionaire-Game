// ==================================================== //
// ==== معالجة الإجابة والانتقال للفوز عند السؤال 10 == //
// ==================================================== //

import {
  letsPlayAudio,
  selectedAnswerAudio,
  correctAnswerAudio,
  wrongAnswerAudio,
  isAudioEnabled
} from "./audio.js";

import {
  QUESTIONS,
  getCurrentQuestionIndex,
  setCurrentQuestionIndex,
  displayNextQuestion
} from "./question.js";

import { endGame } from "./gameState.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// حساب محطات الأمان عند الخسارة
function getGuaranteedPrize(questionIdx) {
  if (questionIdx >= 7) return "نص دينار"; // اجتاز السؤال 7
  if (questionIdx >= 4) return "10 قروش"; // اجتاز السؤال 4
  return "0 قرش";
}

async function handleAnswer(e) {
  const playAudio = isAudioEnabled();
  const selectedAnswer = Number(e.currentTarget.dataset.id);

  // قفل النقر لمنع الضغط المزدوج أثناء التوتر
  const optionsGrid = document.getElementById("options-grid");
  optionsGrid.classList.add("pointer-events-none");

  const options = Array.from(document.getElementsByClassName("options"));
  const currentQuestion = JSON.parse(localStorage.getItem("currentQuestion"));
  const currentAnswer = Number(currentQuestion.correct);
  const qIndex = getCurrentQuestionIndex();

  if (playAudio) {
    letsPlayAudio.pause();
    selectedAnswerAudio.currentTime = 0;
    selectedAnswerAudio.play().catch(() => {});
  }
  options[selectedAnswer].classList.add("selected-answer");

  // انتظار لحظة التوتر (2.5 ثانية)
  await delay(2500);

  if (selectedAnswer !== currentAnswer) {
    // إجابة خاطئة
    options[selectedAnswer].classList.replace("selected-answer", "wrong-answer");
    options[currentAnswer].classList.add("correct-answer");
    selectedAnswerAudio.pause();
    if (playAudio) {
      wrongAnswerAudio.currentTime = 0;
      wrongAnswerAudio.play().catch(() => {});
    }
    await delay(2500);
    endGame(false, getGuaranteedPrize(qIndex));
  } else {
    // إجابة صحيحة
    options[selectedAnswer].classList.replace("selected-answer", "correct-answer");
    selectedAnswerAudio.pause();
    if (playAudio) {
      correctAnswerAudio.currentTime = 0;
      correctAnswerAudio.play().catch(() => {});
    }

    await delay(3500);

    // إذا كان هذا هو السؤال العاشر (index 9) -> الفوز بالجائزة الكبرى!
    if (qIndex >= QUESTIONS.length - 1) {
      endGame(true, "1.99 دينار");
    } else {
      setCurrentQuestionIndex(qIndex + 1);
      displayNextQuestion();
    }
  }
}

export { handleAnswer };
