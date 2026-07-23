import { performSearch, calculateStylesBitmask } from "./wholeJS.js";

function scrollToSearch() {
    const target = document.querySelector('.type-select');
    const top = target.getBoundingClientRect().top + window.scrollY - 100; // 100px 더 위로
    window.scrollTo({ top: top, behavior: 'smooth' });
}

// 메인 페이지 검색 카드(목적지 입력 + 여행 스타일 체크박스) → travel-list 페이지 검색 이동
function initMainSearch() {
    const searchBtn = document.querySelector('.type-select .search-btn');
    const keywordInput = document.getElementById('keywordInput');

    if (searchBtn && keywordInput) {
        searchBtn.addEventListener('click', () => {
            const styleCheckboxes = document.querySelectorAll('.type-button input[name="styles"]');

            const keyword = keywordInput.value.trim();
            const styles = calculateStylesBitmask(styleCheckboxes);

            performSearch(keyword, styles);
        });
    }

    // 버튼을 누르면 메인 페이지 상단 검색 카드 영역으로 스크롤 이동
    const scrollSearchBtn = document.getElementById("scrollSearchBtn");

    if (scrollSearchBtn) {
        scrollSearchBtn.addEventListener("click", scrollToSearch);
    }
}

initMainSearch();