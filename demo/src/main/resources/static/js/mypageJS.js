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
            alert("회원 탈퇴가 완료되었습니다.");
            window.location.href = "/index.html";
        } else {
            const message = await response.text();
            alert(message);
        }
    } catch (error) {
        console.error("회원 탈퇴 오류:", error);
        alert("회원 탈퇴 처리 중 오류가 발생했습니다.");
    }
}

initWithdraw();