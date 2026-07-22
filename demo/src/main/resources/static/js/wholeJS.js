function myOrLogin() {
    const loginBtn = document.querySelector("#loginBtn");
    const myPageBtn = document.querySelector("#myPageBtn");
    const logoutBtn = document.querySelector("#logoutBtn");

    fetch("/api/me")
        .then(function (response) {
            if (response.ok) {
                loginBtn.style.display = "none";
                myPageBtn.style.display = "inline-block";
                logoutBtn.style.display = "inline-block";
            } else {
                loginBtn.style.display = "inline-block";
                myPageBtn.style.display = "none";
                logoutBtn.style.display = "none";
            }
        })
        .catch(function () {
            loginBtn.style.display = "inline-block";
            myPageBtn.style.display = "none";
            logoutBtn.style.display = "none";
        });

    logoutBtn.addEventListener("click", function (e) {
        e.preventDefault();
        fetch("/api/logout", { method: "POST" })
            .then(function () {
                window.location.reload();
            });
    });
}

myOrLogin();