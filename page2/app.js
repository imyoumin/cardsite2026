(() => {
  // =========================
  // 1) 화면 스케일(기기별 대응)
  // =========================
  const stage = document.getElementById("stage");
  const root = document.documentElement;

  const BASE_W = 414; // style.css --base-w 와 동일
  const BASE_H = 940; // style.css --base-h 와 동일

  function updateScale() {
    if (!stage) return;
    const w = stage.clientWidth;
    const h = stage.clientHeight;

    // 가로/세로 중 더 빡센 쪽에 맞춰서 축소(비율 유지)
    const s = Math.min(w / BASE_W, h / BASE_H);
    root.style.setProperty("--s", String(s));
  }

  updateScale();
  window.addEventListener("resize", updateScale);
  window.addEventListener("orientationchange", () => setTimeout(updateScale, 200));

  // =========================
  // 2) 운세 77개 랜덤 + 애니메이션
  // =========================
  const fortunesText = `
생각지도 못한 곳에서 밀려오는 행운의 파도를 맞이하게 됩니다.
걷는 길마다 화사한 꽃길이 펼쳐지는 마법 같은 한 해를 보냅니다.
올해의 주인공이 되어 세상에서 가장 빛나는 무대에 서게 됩니다.
오랫동안 간직해온 행운의 열쇠로 소중한 기회의 문을 엽니다.
스스로를 돕는 자가 되어 지난날의 모든 노력을 결실로 바꿉니다.
잃어버린 것보다 훨씬 더 큰 행운으로 마음의 빈자리를 채웁니다.
나쁜 기운을 모두 떨쳐내고 맑은 기운만 가득한 사계절을 누립니다.
운'이라는 든든한 바람을 타고 인생이라는 돛을 힘차게 펼칩니다.
작은 씨앗을 커다란 나무로 키워내듯 사소한 시작을 큰 복으로 만듭니다.
머무는 곳마다 웃음꽃을 피우며 발길 닿는 곳마다 복을 불러옵니다.
특유의 긍정적인 에너지로 주변에 숨어있던 모든 행운을 끌어당깁니다.
인생 최고의 황금기가 시작되는 찬란한 원년을 맞이하게 됩니다.
길가에 굴러다니던 평범한 돌을 보석으로 바꾸는 기적을 경험합니다.
답답하게 막혀있던 운의 흐름을 시원하게 뚫어내고 거침없이 나아갑니다.
동서남북 어디서든 나타나 손을 내미는 소중한 귀인들을 만나게 됩니다.
지갑이 마를 날이 없을 정도로 풍요롭고 넉넉한 한 해를 약속받습니다.
그동안 투자한 시간과 노력이 배가 되어 통장에 찍히는 기쁨을 누립니다.
폭포수처럼 쏟아져 들어오는 재물운의 흐름 속에 몸을 맡기게 됩니다.
강한 문서운을 타고나 계약이나 매매에서 예상치 못한 큰 이득을 봅니다.
승진의 기쁨을 만끽하며 자신의 명예를 세상에 드높이는 해를 보냅니다.
번뜩이는 새로운 사업 아이템을 통해 성공 가도로 화려하게 진입합니다.
금전적인 고민을 눈 녹듯 사라지게 만들며 여유로운 상반기를 보냅니다.
생각지 못한 특별 보너스나 당첨운이 기다리는 설레는 일상을 맞이합니다.
티끌 모아 태산을 이루듯 자신의 자산을 눈에 띄게 증식시키게 됩니다.
자신의 이름 석 자를 널리 알리며 많은 이들에게 인정받는 위치에 오릅니다.
정성껏 뿌린 대로 풍성하게 거두며 그 수확물로 인해 즐겁게 춤추게 됩니다.
경제적 자유라는 목표를 향해 커다란 한 걸음을 내딛는 도약의 해를 삽니다.
들어오는 돈은 늘리고 나가는 돈은 철저히 막는 알짜배기 자산가가 됩니다.
치열한 경쟁에서 당당히 승리하고 오랫동안 원했던 자리를 쟁취합니다.
타고난 재능을 마음껏 발휘하여 부와 명예라는 두 마리 토끼를 잡습니다.
소중한 연인과의 관계를 더욱 깊게 다지며 아름다운 결실을 맺게 됩니다.
묵은 오해를 풀고 신뢰를 두터워지게 쌓아 올리는 화합의 시간을 보냅니다.
운명적인 인연이 당신의 마음 문을 조심스럽게 두드리는 소리를 듣습니다.
가족 모두가 화목하고 평안하여 '가화만사성'의 참된 행복을 경험합니다.
잠시 잊고 지냈던 소중한 옛 친구로부터 반가운 연락과 소식을 듣게 됩니다.
매력이 최고조에 달하는 시기를 맞아 만인의 사랑과 관심을 한몸에 받습니다.
서로의 부족한 조각을 완벽하게 채워줄 소울메이트를 극적으로 만납니다.
갈등이 있었던 관계를 봄눈 녹듯 부드럽게 매듭짓고 마음의 짐을 덜어냅니다.
사랑하는 사람과 손을 잡고 특별한 추억을 쌓을 꿈같은 여행을 떠납니다.
주변 사람들의 아낌없는 도움을 받아 어려운 문제들을 아주 쉽게 해결합니다.
첫눈에 반할 만큼 강렬하고 짜릿한 설렘이 일상으로 찾아오는 것을 느낍니다.
진심을 꾹꾹 눌러 담은 말 한마디로 소중한 상대의 마음을 움직이게 됩니다.
다툼은 아주 짧고 화해는 긴, 사랑과 정이 넘치는 따뜻한 일상을 누립니다.
새로 나간 모임에서 당신의 진정한 가치를 알아주는 진짜 인연들을 만납니다.
남을 배려하는 따뜻한 마음씨가 더 큰 사랑과 복이 되어 돌아옴을 확인합니다.
몸과 마음이 이전보다 훨씬 가볍고 활기찬 기운으로 가득한 날들을 보냅니다.
지쳤던 영혼에 충분한 휴식을 선물하고 다시 일어설 굳건한 힘을 얻습니다.
오늘부터 시작한 규칙적인 습관으로 스스로를 더욱 젊고 건강하게 만듭니다.
보약보다 귀한 '웃음'이 집안에 끊이지 않는 행복한 일상을 살아갑니다.
마음속 깊은 곳의 불안을 지워내고 평온함이 깃든 안식처를 발견하게 됩니다.
오랫동안 불편했던 곳이 씻은 듯 낫고 넘치는 기력을 회복하게 됩니다.
매일 밤 깊은 숙면을 취하며 어느 때보다 상쾌한 아침을 맞이하게 됩니다.
복잡하게 얽혀있던 생각들을 말끔히 정리하고 명쾌해진 머릿속을 체감합니다.
대자연의 품 안에서 새로운 생명력을 얻으며 스스로를 치유하는 해를 보냅니다.
어떤 스트레스도 가볍게 비껴가게 만드는 단단하고 유연한 마음을 갖게 됩니다.
소박한 식탁 앞에서도 커다란 행복을 발견하는 평온한 삶의 주인공이 됩니다.
운동의 즐거움을 새롭게 깨달아 자신이 꿈꾸던 건강한 몸을 완성해 나갑니다.
꾸준한 명상과 독서를 통해 내면이 한층 더 성숙해지는 해를 경험하게 됩니다.
작은 사고 하나 없이 무탈하고 평탄하게 흘러가는 평화로운 한 해를 보냅니다.
소중한 보금자리에 따스한 온기와 평화가 가득 차오르는 것을 느끼게 됩니다.
오래전부터 가슴에 품어왔던 버킷리스트들을 하나씩 멋지게 실현해 냅니다.
스스로도 놀랄 만큼의 잠재력을 폭발시켜 자신의 한계를 훌쩍 뛰어넘습니다.
어떤 두려움도 없이 새로운 도전에 뛰어들어 결국 값진 성공을 거머쥐게 됩니다.
평소 배우고 싶었던 분야에서 압도적인 두각을 나타내며 주변을 놀라게 합니다.
과거의 실패가 사실은 오늘의 성공을 위한 귀한 밑거름이었음을 깨닫게 됩니다.
변화를 두려워하지 않는 용기를 통해 자신에게 찾아온 기회를 완벽히 붙잡습니다.
인생의 커다란 전환점이 될 소중한 가르침과 깨달음을 얻는 해를 보냅니다.
자신감이 넘치는 태도로 무장하여 그 어떤 어려운 일도 거뜬히 해결해 냅니다.
가슴속에 간직한 창의적인 아이디어로 세상을 깜짝 놀라게 할 준비를 마칩니다.
오늘 시작한 작은 습관의 변화가 인생 전체를 바꾸는 놀라운 경험을 하게 됩니다.
스스로를 굳게 믿는 마음이야말로 세상에서 가장 강력한 무기임을 증명합니다.
계획했던 공부나 목표로 했던 자격증 취득에서 당당히 합격의 기쁨을 누립니다.
더 넓은 세상으로 나아갈 수 있는 기회의 문이 활짝 열리는 것을 목격합니다.
자신의 진심을 담은 목소리로 누군가에게 다시 일어설 희망을 주는 사람이 됩니다.
어제의 자신보다 오늘 더 성장한 모습에 스스로 대견함을 느끼는 날들을 보냅니다.
처음 목표했던 지점보다 훨씬 더 멀리, 더 높이 비상하며 세상을 내려다봅니다.
올해를 인생에서 가장 아름답고 찬란한 기록으로 남기며 최고의 해로 만듭니다.
  `.trim();

  const fortunes = fortunesText.split("\n").map(s => s.trim()).filter(Boolean);

  // ✅ 새로고침마다 랜덤 (오늘 고정 원하면 true)
  const KEEP_SAME_FOR_TODAY = false;

  function getTodayKey() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `fortune_${yyyy}${mm}${dd}`;
  }

  function pickFortune() {
    if (!fortunes.length) return "운세를 불러오지 못했어요.";

    if (KEEP_SAME_FOR_TODAY) {
      const key = getTodayKey();
      const saved = localStorage.getItem(key);
      if (saved) return saved;

      const chosen = fortunes[Math.floor(Math.random() * fortunes.length)];
      localStorage.setItem(key, chosen);
      return chosen;
    }

    return fortunes[Math.floor(Math.random() * fortunes.length)];
  }

  function animateFortune(el, text) {
    if (!el) return;

    // 애니메이션 클래스 리셋
    el.classList.remove("animate-in", "sparkle", "typing");
    void el.offsetWidth; // reflow
    el.classList.add("animate-in", "sparkle", "typing");

    // 타자치기 효과
    el.textContent = "";
    let i = 0;

    const minDelay = 14;
    const maxDelay = 30;

    const tick = () => {
      el.textContent = text.slice(0, i);
      i += 1;

      if (i <= text.length) {
        const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
        setTimeout(tick, delay);
      } else {
        el.classList.remove("typing"); // 커서 제거
      }
    };

    tick();
  }

  window.addEventListener("load", () => {
    const messageEl = document.querySelector(".message");
    const fortune = pickFortune();
    animateFortune(messageEl, fortune);

    // ✅ "운세가 마음에 안 드시나요" 클릭 -> 새 운세로 리로드
    // ✅ "운세가 마음에 안 드시나요" 클릭 -> 페이지 새로고침
    const retryEl = document.getElementById("retryBtn");
    if (retryEl) {
    retryEl.addEventListener("click", () => {
        location.reload(); // 그냥 새로고침
    });
    }

  });
})();
