const loginBtn = document.getElementById("login-btn");
const emailInput = document.getElementById("login-email");
const pwInput = document.getElementById("login-pw");
const errorBox = document.getElementById("login-error");
const togglePw = document.getElementById("toggle-pw");

// [기능 3] 눈 버튼 → 비밀번호 표시/숨김 토글
togglePw.addEventListener("click", function () {
    if (pwInput.type === "password") {
        pwInput.type = "text";      // 보이게
        togglePw.textContent = "🚫";
    } else {
        pwInput.type = "password";  // 다시 숨기기
        togglePw.textContent = "👁";
    }
});

// 로그인 실행 함수
function doLogin() {
    const email = emailInput.value;
    const password = pwInput.value;
    const keepLoggedIn = document.getElementById("keep-login").checked;

    errorBox.classList.remove("show"); // 이전 에러 문구 숨기기

    fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: password, keepLoggedIn: keepLoggedIn })
    })
        .then(function (response) {
            if (response.ok) {
                // [기능 1] 팝업 없이 바로 메인으로
                window.location.href = "index";
            } else {
                // [기능 4] 실패: 비번 칸 비우고 + 문구 표시
                pwInput.value = "";
                errorBox.innerHTML = "ログインに失敗しました。<br>正しいメールアドレスとパスワードを入力してください。";
                errorBox.classList.add("show");
            }
        })
        .catch(function (error) {
            errorBox.textContent = "ログイン処理中にエラーが発生しました。";
            errorBox.classList.add("show");
            console.error(error);
        });
}

// 버튼 클릭 시 로그인
loginBtn.addEventListener("click", doLogin);

// [기능 2] 엔터 키로도 로그인
emailInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") doLogin();
});
pwInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") doLogin();
});