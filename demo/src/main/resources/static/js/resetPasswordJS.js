document.getElementById("reset-btn").addEventListener("click", function () {

    const email = document.getElementById("reset-email").value;
    const newPassword = document.getElementById("reset-pw").value;

    fetch("/api/reset-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email, newPassword: newPassword })
    })
        .then(function (response) {
            return response.text().then(function (message) {
                alert(message);
                if (response.ok) {
                    window.location.href = "logIn";
                }
            });
        })
        .catch(function (error) {
            alert("処理中にエラーが発生しました。");
            console.error(error);
        });
});