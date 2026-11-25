const firstPingAudio = document.getElementById("first-ping");
const secondPingAudio = document.getElementById("second-ping");
const thirdPingAudio = document.getElementById("third-ping");
const letsPlayAudio = document.getElementById("lets-play-audio");
const selectedAnswerAudio = document.getElementById("selected-answer-audio");
const correctAnswerAudio = document.getElementById("correct-answer-audio");
const wrongAnswerAudio = document.getElementById("wrong-answer-audio");

function isAudioEnabled() {
  const stored = localStorage.getItem("playAudio");
  return stored === null ? true : JSON.parse(stored);
}

export {
  firstPingAudio,
  secondPingAudio,
  thirdPingAudio,
  letsPlayAudio,
  selectedAnswerAudio,
  correctAnswerAudio,
  wrongAnswerAudio,
  isAudioEnabled
};
