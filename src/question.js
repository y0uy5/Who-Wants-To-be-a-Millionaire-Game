// ==================================================== //
// ==== ملف الأسئلة الـ 10 وسلم الجوائز (عربي) ====== //
// ==================================================== //

import { letsPlayAudio, isAudioEnabled } from "./audio.js";
import { resetState } from "./gameState.js";
import { handleAnswer } from "./answer.js";

// سلم الجوائز الـ 10
const PRIZE_LADDER = [
  "1 قرش",
  "3 قروش",
  "5 قروش",
  "10 قروش",
  "20 قرش",
  "ربع دينار",
  "نص دينار",
  "دينار واحد",
  "دينار ونص",
  "1.99 دينار"
];

// قائمة الأسئلة الـ 10 (عدّل النصوص هنا بحريتك)
const QUESTIONS = [
  {
    question: "ما هو لون الحليب الطبيعي؟",
    content: ["أبيض", "أزرق سماوي", "فسفوري", "شفاف"],
    correct: 0
  },
  {
    question: "إذا أكلت شاورما بدون مثومة، فماذا يُعتبر هذا الفعل في العُرف الأردني؟",
    content: [
      "خيانة عظمى للسندويشة",
      "نظام صحي متكامل",
      "توفير استراتيجي",
      "وصفة فرنسية"
    ],
    correct: 0
  },
  {
    question: "كم تساوي مدة «خمس دقائق وبكون عندك» عند الشباب؟",
    content: [
      "5 دقائق بالضبط",
      "نصف ساعة إلى ما لا نهاية",
      "30 ثانية",
      "دقيقتين ونص"
    ],
    correct: 1
  },
  {
    question: "ما هي المدينة الأردنية التي تُلقّب بـ «عروس الشمال»؟",
    content: ["السلط", "إربد", "الكرك", "معان"],
    correct: 1
  },
  {
    question: "أي من هذه العبارات تعني باللهجة الأردنية «اترك الموضوع عليّ ولا تهكل هم»؟",
    content: ["أبشر بعزّك", "يعطيك العافية", "صحّتين وهنا", "مساء الخير"],
    correct: 0
  },
  {
    question: "ما هو المكوّن الأساسي الذي يُصنع منه الجميد الكركي الأصيل؟",
    content: [
      "حليب الغنم أو الماعز",
      "حليب جوز الهند",
      "طحين القمح",
      "زيت الزيتون"
    ],
    correct: 0
  },
  {
    question: "كم يبلغ مجموع قياس زوايا المثلث الداخلية؟",
    content: ["90 درجة", "180 درجة", "270 درجة", "360 درجة"],
    correct: 1
  },
  {
    question: "ما هو الكوكب الذي يُعرف في مجموعتنا الشمسية باسم «الكوكب الأحمر»؟",
    content: ["المشتري", "الزهرة", "المريخ", "زحل"],
    correct: 2
  },
  {
    question: "ما هي أطول سورة في القرآن الكريم؟",
    content: ["سورة آل عمران", "سورة النساء", "سورة البقرة", "سورة الأعراف"],
    correct: 2
  },
  {
    question: "إذا ربحت اليوم دينار و99 قرش، كم يتبقى لك لتُكمل الدينارين؟",
    content: ["قرش واحد فقط", "نصف دينار", "عشرة قروش", "ربع دينار"],
    correct: 0
  }
];

let currentQuestionIndex = 0;

function getCurrentQuestionIndex() {
  return currentQuestionIndex;
}

function setCurrentQuestionIndex(index) {
  currentQuestionIndex = index;
}

// تحديث تمييز سلم الجوائز
function updateMoneyLadder(levelIndex) {
  const items = document.querySelectorAll("#money-ladder li");
  items.forEach((item) => {
    item.classList.remove("money-active");
    if (Number(item.dataset.level) === levelIndex) {
      item.classList.add("money-active");
    }
  });

  const badge = document.getElementById("current-prize-badge");
  if (badge) {
    badge.textContent = `السؤال ${levelIndex + 1} من 10 • قيمة الجائزة: ${PRIZE_LADDER[levelIndex]}`;
  }
}

// عرض السؤال الحالي
function displayNextQuestion() {
  resetState();
  if (isAudioEnabled()) {
    letsPlayAudio.play().catch(() => {});
  }

  const questionObj = QUESTIONS[currentQuestionIndex];
  localStorage.setItem("currentQuestion", JSON.stringify(questionObj));
  updateMoneyLadder(currentQuestionIndex);
  displayQuestion(questionObj);
}

function displayQuestion(questionObject) {
  const questionCard = document.getElementById("question-card");
  questionCard.innerHTML = `<h2>${questionObject.question}</h2>`;

  const letters = ["أ:", "ب:", "ج:", "د:"];
  const optionIds = ["option-one", "option-two", "option-three", "option-four"];

  optionIds.forEach((id, idx) => {
    const el = document.getElementById(id);
    el.innerHTML = `
      <span class="text-orange font-black ml-2">${letters[idx]}</span>
      <span>${questionObject.content[idx]}</span>
    `;
    el.onclick = handleAnswer;
  });
}

export {
  QUESTIONS,
  PRIZE_LADDER,
  getCurrentQuestionIndex,
  setCurrentQuestionIndex,
  displayNextQuestion,
  updateMoneyLadder
};
