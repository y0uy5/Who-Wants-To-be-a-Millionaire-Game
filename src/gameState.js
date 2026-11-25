// ====================================================== //
// ==== إدارة حالة اللعبة ووسائل المساعدة ============== //
// ====================================================== //

import {
  letsPlayAudio,
  firstPingAudio,
  secondPingAudio,
  thirdPingAudio,
  isAudioEnabled
} from "./audio.js";

import {
  welcomeSection,
  questionSection,
  endgameModal,
  lifelineModal
} from "./page.js";

import {
  letsPlayBtn,
  fiftyFiftyBtn,
  phoneFriendBtn,
  askAudienceBtn
} from "./button.js";

import {
  displayNextQuestion,
  setCurrentQuestionIndex
} from "./question.js";

let phoneTimerInterval = null;

function startGame() {
  if (isAudioEnabled()) {
    letsPlayAudio.play().catch(() => {});
  }
  welcomeSection.style.display = "none";
  letsPlayBtn.style.display = "none";
  questionSection.style.display = "flex";
  setCurrentQuestionIndex(0);
  displayNextQuestion();
}

function endGame(isWinner, prizeWon) {
  letsPlayAudio.pause();
  const titleEl = document.getElementById("endgame-title");
  const subtitleEl = document.getElementById("endgame-subtitle");
  const prizeEl = document.getElementById("endgame-prize");

  if (isWinner) {
    subtitleEl.textContent = "مبروك الفوز الساحق!";
    titleEl.textContent = "لقد ربحت الدينار و99 قرش!";
    titleEl.className = "text-3xl sm:text-4xl font-black mb-4 text-green-400";
  } else {
    subtitleEl.textContent = "حظ أوفر في المرة القادمة";
    titleEl.textContent = "إجابة خاطئة! انتهت اللعبة";
    titleEl.className = "text-3xl sm:text-4xl font-black mb-4 text-red-400";
  }

  prizeEl.textContent = prizeWon;
  endgameModal.classList.remove("hidden");
}

function restartGame() {
  endgameModal.classList.add("hidden");
  fiftyFiftyBtn.classList.remove("lifeline-used");
  phoneFriendBtn.classList.remove("lifeline-used");
  askAudienceBtn.classList.remove("lifeline-used");
  setCurrentQuestionIndex(0);
  displayNextQuestion();
}

function resetState() {
  const optionsGrid = document.getElementById("options-grid");
  if (optionsGrid) {
    optionsGrid.classList.remove("pointer-events-none");
  }
  const options = document.getElementsByClassName("options");
  for (let i = 0; i < options.length; i++) {
    options[i].classList.remove(
      "selected-answer",
      "correct-answer",
      "wrong-answer",
      "disabled-option"
    );
  }
}

// 1. وسيلة حذف إجابتين (50:50)
function useFiftyFifty() {
  if (fiftyFiftyBtn.classList.contains("lifeline-used")) return;
  fiftyFiftyBtn.classList.add("lifeline-used");

  if (isAudioEnabled()) {
    firstPingAudio.currentTime = 0;
    firstPingAudio.play().catch(() => {});
  }

  const currentQuestion = JSON.parse(localStorage.getItem("currentQuestion"));
  const correctIdx = Number(currentQuestion.correct);
  const wrongIndices = [0, 1, 2, 3].filter((i) => i !== correctIdx);

  // اختيار إجابتين خاطئتين عشوائياً لحذفهما
  wrongIndices.sort(() => Math.random() - 0.5);
  const toHide = wrongIndices.slice(0, 2);

  const options = document.getElementsByClassName("options");
  toHide.forEach((idx) => {
    options[idx].classList.add("disabled-option");
  });
}

// 2. وسيلة الاتصال بصديق (مؤقت 30 ثانية)
function usePhoneFriend() {
  if (phoneFriendBtn.classList.contains("lifeline-used")) return;
  phoneFriendBtn.classList.add("lifeline-used");

  if (isAudioEnabled()) {
    secondPingAudio.currentTime = 0;
    secondPingAudio.play().catch(() => {});
  }

  const titleEl = document.getElementById("lifeline-title");
  const bodyEl = document.getElementById("lifeline-body");

  let secondsLeft = 30;
  titleEl.textContent = "اتصال بصديق";
  bodyEl.innerHTML = `
    <p class="mb-3">جاري الاتصال بصديقك... معك 30 ثانية!</p>
    <div id="phone-timer" class="text-5xl font-black text-orange my-2">${secondsLeft}</div>
  `;
  lifelineModal.classList.remove("hidden");

  clearInterval(phoneTimerInterval);
  phoneTimerInterval = setInterval(() => {
    secondsLeft--;
    const timerEl = document.getElementById("phone-timer");
    if (timerEl) timerEl.textContent = secondsLeft;
    if (secondsLeft <= 0) {
      clearInterval(phoneTimerInterval);
      if (timerEl) timerEl.textContent = "انتهى الوقت!";
    }
  }, 1000);
}

// 3. وسيلة رأي الجمهور
function useAskAudience() {
  if (askAudienceBtn.classList.contains("lifeline-used")) return;
  askAudienceBtn.classList.add("lifeline-used");

  if (isAudioEnabled()) {
    thirdPingAudio.currentTime = 0;
    thirdPingAudio.play().catch(() => {});
  }

  const currentQuestion = JSON.parse(localStorage.getItem("currentQuestion"));
  const correctIdx = Number(currentQuestion.correct);

  // توزيع نسب واقعية ترجح الإجابة الصحيحة
  const percentages = [8, 9, 11, 10];
  percentages[correctIdx] = 72;

  const letters = ["أ", "ب", "ج", "د"];
  const titleEl = document.getElementById("lifeline-title");
  const bodyEl = document.getElementById("lifeline-body");

  titleEl.textContent = "نتيجة تصويت الجمهور";
  bodyEl.innerHTML = `
    <div class="space-y-3 text-right">
      ${letters
        .map(
          (letter, idx) => `
        <div>
          <div class="flex justify-between text-sm font-bold mb-1">
            <span>الخيار (${letter})</span>
            <span class="text-orange">${percentages[idx]}%</span>
          </div>
          <div class="w-full bg-darkerBlue rounded-full h-4 border border-silverWhite overflow-hidden">
            <div class="bg-orange h-full" style="width: ${percentages[idx]}%"></div>
          </div>
        </div>
      `
        )
        .join("")}
    </div>
  `;
  lifelineModal.classList.remove("hidden");
}

function clearPhoneTimer() {
  clearInterval(phoneTimerInterval);
}

export {
  startGame,
  endGame,
  restartGame,
  resetState,
  useFiftyFifty,
  usePhoneFriend,
  useAskAudience,
  clearPhoneTimer
};
