import { letsPlayAudio } from "./audio.js";
import {
  letsPlayBtn,
  audioBtnControl,
  fiftyFiftyBtn,
  phoneFriendBtn,
  askAudienceBtn,
  restartBtn,
  closeModalBtn
} from "./button.js";
import {
  startGame,
  restartGame,
  useFiftyFifty,
  usePhoneFriend,
  useAskAudience,
  clearPhoneTimer
} from "./gameState.js";
import { lifelineModal } from "./page.js";

let playAudio = true;
localStorage.setItem("playAudio", JSON.stringify(playAudio));

letsPlayBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);
fiftyFiftyBtn.addEventListener("click", useFiftyFifty);
phoneFriendBtn.addEventListener("click", usePhoneFriend);
askAudienceBtn.addEventListener("click", useAskAudience);

closeModalBtn.addEventListener("click", () => {
  clearPhoneTimer();
  lifelineModal.classList.add("hidden");
});

const mute = document.querySelector(".mute");
const unmute = document.querySelector(".unmute");

audioBtnControl.addEventListener("click", () => {
  playAudio = JSON.parse(localStorage.getItem("playAudio"));
  playAudio = !playAudio;
  localStorage.setItem("playAudio", JSON.stringify(playAudio));

  if (playAudio) {
    letsPlayAudio.play().catch(() => {});
    unmute.classList.add("hidden");
    mute.classList.remove("hidden");
  } else {
    letsPlayAudio.pause();
    unmute.classList.remove("hidden");
    mute.classList.add("hidden");
  }
});
