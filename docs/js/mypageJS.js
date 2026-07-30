(async function checkAuth() {
  const res = await fetch("/api/mypage/user");
  if (!res.ok) {
    location.replace("/logIn");
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
        const response = await fetch("/api/withdraw", {
            method: "DELETE"
        });

        if (response.ok) {
            alert("退会が完了しました。");
            window.location.href = "/index";
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