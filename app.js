let model;
let webcamStream;
let running = true;

const MODEL_URL = "./model/";

// ✅ 튜닝 파라미터
const TARGET_CLASS = "Class 2";
const THRESHOLD = 0.90;
const REQUIRED_HITS = 3;
const PREDICT_FPS = 10;

// ✅ 로딩 문구
const LOADING_MESSAGES = [
  "2026년을 향해 전력질주 중...",
  "말발굽 소리가 들리나요?",
  "엽서 속 기운 감별 중",
  "2026 행운 편자 제작 중",
  "행운 함유량 측정 중",
  "미래 기운 스캔 중"
];

// ✅ 5초쯤 보이게(6문장 기준)
const LOADING_STEP_MS = 830;

// ✅ 이동
const GO_PAGE = "./page2/";

// -----------------------------
// ✅ 오디오 디버그 + unlock
// -----------------------------
let audioUnlocked = false;

function logAudioState(prefix = "[hoof]") {
  const hoof = document.getElementById("hoof-audio");
  if (!hoof) return console.warn(prefix, "audio element not found");

  console.log(
    prefix,
    "src=", hoof.currentSrc || hoof.src,
    "readyState=", hoof.readyState,
    "networkState=", hoof.networkState,
    "muted=", hoof.muted,
    "vol=", hoof.volume,
    "paused=", hoof.paused
  );
}

async function unlockAudioOnce() {
  if (audioUnlocked) return;

  const hoof = document.getElementById("hoof-audio");
  if (!hoof) return console.warn("[hoof] audio element not found");

  try {
    // ✅ 경로 확인 로그
    logAudioState("[hoof unlock] before");

    // ✅ "사용자 제스처" 안에서 실제로 play를 성공시켜야 unlock됨
    hoof.volume = 1;
    hoof.muted = false;

    const p = hoof.play();
    if (p) await p;      // 여기서 NotAllowedError 등 확인 가능

    // 바로 멈춰서 이후 자동 재생 가능 상태로
    hoof.pause();
    hoof.currentTime = 0;

    audioUnlocked = true;
    console.log("[hoof] ✅ unlocked by user gesture");
    logAudioState("[hoof unlock] after");
  } catch (e) {
    console.warn("[hoof] ❌ unlock failed:", e);
    logAudioState("[hoof unlock] failed state");
  }
}

// ✅ 한번 클릭/터치 하면 unlock 시도
window.addEventListener("pointerdown", unlockAudioOnce, { once: true });
window.addEventListener("touchstart", unlockAudioOnce, { once: true });

// 추가: 오디오 로딩 에러 확인
window.addEventListener("load", () => {
  const hoof = document.getElementById("hoof-audio");
  if (!hoof) return;

  hoof.addEventListener("error", () => {
    console.error("[hoof] audio error:", hoof.error, "src:", hoof.currentSrc || hoof.src);
  });

  console.log("[hoof] audio tag found");
  logAudioState("[hoof] initial");
});

// -----------------------------
let hitCount = 0;
let lastPredictTime = 0;

async function init() {
  const video = document.getElementById("webcam-video");

  // 1) 카메라 연결
  try {
    webcamStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    });
    video.srcObject = webcamStream;
    await video.play();
  } catch (e) {
    console.error("카메라 권한/실행 실패:", e);
    return;
  }

  // 2) 모델 로드
  try {
    const modelURL = MODEL_URL + "model.json";
    const metadataURL = MODEL_URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    console.log("✅ model loaded");
  } catch (e) {
    console.error("모델 로드 실패:", e);
    return;
  }

  // 3) 예측 루프
  requestAnimationFrame(loop);
}

async function loop(now) {
  if (!running) return;

  const interval = 1000 / PREDICT_FPS;
  if (now - lastPredictTime >= interval) {
    lastPredictTime = now;
    await predictOnce();
  }

  requestAnimationFrame(loop);
}

async function predictOnce() {
  if (!model) return;

  const video = document.getElementById("webcam-video");
  const prediction = await model.predict(video);

  const target = prediction.find(p => p.className === TARGET_CLASS);
  const prob = target ? target.probability : 0;

  if (prob >= THRESHOLD) hitCount += 1;
  else hitCount = 0;

  if (hitCount >= REQUIRED_HITS) triggerEvent();
}

function triggerEvent() {
  if (!running) return;
  running = false;

  const cameraArea = document.getElementById("camera-area");
  const loadingLayer = document.getElementById("camera-loading");
  const loadingText = document.getElementById("loading-text");

  if (cameraArea) cameraArea.classList.add("is-loading");
  if (loadingLayer) loadingLayer.setAttribute("aria-hidden", "false");

  // ✅ 카메라 정지
  const video = document.getElementById("webcam-video");
  try { video.pause(); } catch {}
  if (webcamStream) webcamStream.getTracks().forEach(t => t.stop());

  // ✅ 말발굽 소리 (에러 로그 남기기)
  const hoof = document.getElementById("hoof-audio");
  if (hoof) {
    hoof.currentTime = 0;
    hoof.volume = 1;
    hoof.muted = false;

    const p = hoof.play();
    if (p && typeof p.catch === "function") {
      p.catch(err => {
        console.warn("[hoof] play failed:", err);
        logAudioState("[hoof] play failed state");
      });
    }
    console.log("[hoof] play() called");
  } else {
    console.warn("[hoof] audio element not found at triggerEvent");
  }

  // ✅ 로딩 문구 순차 표시 후 이동
  let i = 0;
  if (loadingText) loadingText.textContent = LOADING_MESSAGES[i];

  const timer = setInterval(() => {
    i += 1;

    if (i >= LOADING_MESSAGES.length) {
      clearInterval(timer);
      window.location.href = GO_PAGE;
      return;
    }

    if (loadingText) loadingText.textContent = LOADING_MESSAGES[i];
  }, LOADING_STEP_MS);
}

window.addEventListener("load", init);

window.addEventListener("beforeunload", () => {
  running = false;
  if (webcamStream) webcamStream.getTracks().forEach(t => t.stop());
});
