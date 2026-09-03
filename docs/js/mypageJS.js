(async function checkAuth() {
  const res = await fetch(`${API_BASE}/api/mypage/user`, { credentials: "include" });
  if (!res.ok) {
    location.replace("logIn");
  }
})();

function initWithdraw() {
    document.getElementById("withdrawBtn")
        .addEventListener("click", function (event) {
            event.preventDefault();
            openWithdrawModal();
        });

    document.getElementById("cancelWithdrawBtn")
        .addEventListener("click", closeWithdrawModal);

    document.getElementById("confirmWithdrawBtn")
        .addEventListener("click", withdrawUser);
}

function openWithdrawModal() {
    document.getElementById("withdrawModalOverlay").classList.add("open");
}

function closeWithdrawModal() {
    document.getElementById("withdrawModalOverlay").classList.remove("open");
}

async function withdrawUser() {
    try {
        const response = await fetch(`${API_BASE}/api/withdraw`, {
        method: "DELETE",
        credentials: "include"
        });

        if (response.ok) {
            showModal("退会が完了しました。", function () {
                window.location.href = "index";
            });
        } else {
            const message = await response.text();
            showModal(message);
        }
    } catch (error) {
        console.error("退会エラー:", error);
        showModal("退会処理中にエラーが発生しました。");
    }
}

initWithdraw();