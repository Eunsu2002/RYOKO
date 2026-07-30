(async function checkAuth() {
  const res = await fetch(`${API_BASE}/api/mypage/user`, { credentials: "include" });
  if (!res.ok) {
    location.replace("logIn.html");
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
            alert("退会が完了しました。");
            window.location.href = "index.html";
        } else {
            const message = await response.text();
            alert(message);
        }
    } catch (error) {
        console.error("退会エラー:", error);
        alert("退会処理中にエラーが発生しました。");
    }
}

initWithdraw();