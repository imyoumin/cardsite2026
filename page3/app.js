(() => {
  const countdownEl = document.getElementById("countdown");

  // ✅ 총 5초 카운트다운
  let remain = 5;

  function render() {
    if (!countdownEl) return;
    countdownEl.textContent = `(${remain}초 뒤 자동으로 넘어갑니다)`;

    // 살짝 애니메이션
    countdownEl.classList.remove("pulse");
    void countdownEl.offsetWidth;
    countdownEl.classList.add("pulse");
  }

  // 첫 렌더
  render();

  const timer = setInterval(() => {
    remain -= 1;

    if (remain <= 0) {
      clearInterval(timer);

      // ✅ 메인 페이지로 이동
      // - page3/ 안에서 루트로: "../"
      // - 만약 배포 라우팅이 다르면 "/" 또는 "./"로 바꿔도 됨
      window.location.href = "../";
      return;
    }

    render();
  }, 1000);
})();
