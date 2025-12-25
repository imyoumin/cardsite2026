let model;
let webcamStream;
let running = true;

const MODEL_URL = "./model/"; // vercel 배포 기준: /model 폴더

// ✅ 튜닝 파라미터
const TARGET_CLASS = "Class 2";   // 티처블 머신 클래스 이름 정확히 맞춰야 함
const THRESHOLD = 0.90;           // 인식 확률 임계값 (0.8~0.95 추천)
const REQUIRED_HITS = 3;          // 연속 몇 번 맞으면 트리거
const PREDICT_FPS = 10;           // 예측 빈도 (8~12 추천)

// ✅ 로딩 문구 순차 출력
const LOADING_MESSAGES = [
  "2026년을 향해 전력질주 중...",
  "말발굽 소리가 들리나요?",
  "엽서 속 기운 감별 중",
  "2026 행운 편자 제작 중",
  "행운 함유량 측정 중",
  "미래 기운 스캔 중"
];

const LOADING_STEP_MS = 650;      // 문구 바뀌는 속도
const GO_PAGE = "./page2";        // 이동할 페이지

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

  // 3) 예측 루프 시작
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

  // 연속 감지 로직
  if (prob >= THRESHOLD) hitCount += 1;
  else hitCount = 0;

  // 트리거
  if (hitCount >= REQUIRED_HITS) {
    triggerEvent();
  }
}

function triggerEvent() {
  if (!running) return;
  running = false;

  // ✅ 카메라 영역 로딩 화면으로 전환
  const cameraArea = document.getElementById("camera-area");
  const loadingLayer = document.getElementById("camera-loading");
  const loadingText = document.getElementById("loading-text");

  if (cameraArea) cameraArea.classList.add("is-loading");
  if (loadingLayer) loadingLayer.setAttribute("aria-hidden", "false");

  // ✅ 카메라 정지(버벅임 방지)
  const video = document.getElementById("webcam-video");
  try { video.pause(); } catch {}
  if (webcamStream) webcamStream.getTracks().forEach(t => t.stop());

  // (선택) 말발굽 소리
  const hoof = document.getElementById("hoof-audio");
  if (hoof) {
    hoof.currentTime = 0;
    hoof.play().catch(() => {}); // 모바일 정책으로 실패해도 무시
  }

  // ✅ 로딩 문구 순차 표시 후 page2로 이동
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
