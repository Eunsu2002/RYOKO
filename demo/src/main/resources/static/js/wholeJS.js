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
                window.location.href = "index.html";
            });
    });
}
// 메인 페이지와 여행지 페이지가 동시에 활용하는 비트 플래그 계산 기능과 여행지 검색 기능

// 체크된 여행 스타일들의 data-bit 값을 OR 연산하여 하나의 비트 플래그로 계산
// (예: 관광(2) + 미식(8) 선택 -> 10)
export function calculateStylesBitmask(styleCheckboxes) {
    let bitmask = 0;

    styleCheckboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            bitmask |= Number(checkbox.dataset.bit);
        }
    });

    return bitmask;
}

// 검색어 + 스타일 비트 플래그를 URL 쿼리로 만들어 검색
export function performSearch(keyword = "", styles = 0) {
    const params = new URLSearchParams();

    if (keyword) {
        params.set("keyword", keyword);
    }

    if (styles > 0) {
        params.set("styles", String(styles));
    }

    const queryString = params.toString();

    window.location.href = queryString
        ? `travel-list.html?${queryString}`
        : "travel-list.html";
}

myOrLogin();