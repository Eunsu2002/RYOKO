document.getElementById("reset-btn").addEventListener("click", function () {

    const email = document.getElementById("reset-email").value;
    const newPassword = document.getElementById("reset-pw").value;

    fetch(`${API_BASE}/api/reset-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email, newPassword: newPassword })
    })
        .then(function (response) {
            return response.text().then(function (message) {
                if (response.ok) {
                    // 확인 버튼을 누른 뒤 로그인 페이지로 이동
                    showModal(message, function () {
                        window.location.href = "logIn";
                    });
                } else {
                    showModal(message);
                }
            });
        })
        .catch(function (error) {
            showModal("処理中にエラーが発生しました。");
            console.error(error);
        });
});