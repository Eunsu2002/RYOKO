document.getElementById("login-btn").addEventListener("click", function () {

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-pw").value;

    fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email, password: password })
    })
        .then(function (response) {
            return response.text().then(function (message) {
                if (response.ok) {
                    alert(message);
                    window.location.href = "index.html";
                } else {
                    alert(message);
                }
            });
        })
        .catch(function (error) {
            alert("로그인 요청 중 오류가 발생했습니다.");
            console.error(error);
        });
});