// 공통 알림 모달 — alert() 대체용
// 사용법: showModal("메시지")  또는  showModal("메시지", () => { 확인 후 실행 })
(function () {
  // 모달 DOM이 없으면 자동 생성 (페이지에 <div id="uiModalOverlay">가 없어도 동작)
  function ensureModal() {
    if (document.getElementById("uiModalOverlay")) return;
    const overlay = document.createElement("div");
    overlay.id = "uiModalOverlay";
    overlay.className = "ui-modal-overlay";
    overlay.innerHTML = `
      <div class="ui-modal-box">
        <p class="ui-modal-message" id="uiModalMessage"></p>
        <div class="ui-modal-actions">
          <button type="button" id="uiModalOkBtn">確認</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
  }

  window.showModal = function (message, onConfirm) {
    ensureModal();
    const overlay = document.getElementById("uiModalOverlay");
    const msg = document.getElementById("uiModalMessage");
    const okBtn = document.getElementById("uiModalOkBtn");

    msg.textContent = message;
    overlay.classList.add("open");

    // 이전 핸들러 제거를 위해 버튼을 복제 교체
    const newBtn = okBtn.cloneNode(true);
    okBtn.parentNode.replaceChild(newBtn, okBtn);

    newBtn.addEventListener("click", function () {
      overlay.classList.remove("open");
      if (typeof onConfirm === "function") onConfirm();
    });
  };
})();