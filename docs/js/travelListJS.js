// travel-list.html 검색 및 결과 렌더링 스크립트
// - URL의 keyword, styles 값을 읽어 검색 조건을 복원한다.
// - 검색 조건으로 여행지 API를 호출하고 결과 카드를 렌더링한다.
// - 검색 요청은 wholeJS.js의 공통 검색 모듈을 사용한다.
//
// 여행 스타일은 비트 플래그(Integer)로 관리하며,
// 체크박스의 data-bit 값을 조합해 하나의 값으로 저장한다.

import { performSearch, calculateStylesBitmask } from "./wholeJS.js";

function initSearchArea() {
  const form = document.getElementById("searchForm");
  const keywordInput = document.getElementById("keywordInput");

  if (!form || !keywordInput) return;

  const styleCheckboxes = form.querySelectorAll('input[name="styles"]');

  applyParamsToForm(keywordInput, styleCheckboxes);
  fetchAndRenderResults(keywordInput, styleCheckboxes);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const keyword = keywordInput.value.trim();
    const styles = calculateStylesBitmask(styleCheckboxes);

    performSearch(keyword, styles);
  });
}

// URL(keyword, styles)의 값을 검색창/체크박스에 반영
function applyParamsToForm(keywordInput, styleCheckboxes) {
  const params = new URLSearchParams(window.location.search);
  const keyword = params.get("keyword");
  const styles = Number(params.get("styles")) || 0;

  if (keyword) {
    keywordInput.value = keyword;
  }

  // ex) styles = 10 (관광 2 + 미식 8) 이면 각 체크박스의 data-bit와 AND 연산해서 복원
  styleCheckboxes.forEach((checkbox) => {
    const bit = Number(checkbox.dataset.bit);
    checkbox.checked = (styles & bit) !== 0;
  });
}



// 현재 폼 조건으로 /api/places를 호출해 검색 결과를 travel-grid에 렌더링
async function fetchAndRenderResults(keywordInput, styleCheckboxes) {
  const grid = document.getElementById("travelGrid");
  if (!grid) return;

  const params = new URLSearchParams();
  const keyword = keywordInput.value.trim();
  if (keyword) {
    params.set("keyword", keyword);
  }

  const styles = calculateStylesBitmask(styleCheckboxes);
  if (styles > 0) {
    params.set("styles", String(styles));
  }

  try {
    const response = await fetch(`${API_BASE}/api/places?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`검색 요청 실패: ${response.status}`);
    }
    const data = await response.json();
    const places = data.content ?? data;   // 페이지 객체면 content, 배열이면 그대로
    renderTravelCards(grid, places);
    } catch (error) {
    console.error(error);
    grid.innerHTML = '<p class="no-result">검색 결과를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.</p>';
  }
}

// 검색 결과 배열을 travel-card 마크업으로 그려준다.
function renderTravelCards(grid, places) {
  if (!places || places.length === 0) {
    grid.innerHTML = '<p class="no-result">검색 조건에 맞는 여행지가 없습니다.</p>';
    return;
  }

  grid.innerHTML = places.map(createTravelCardHtml).join("");
}

// place 하나를 기존 travel-card 마크업/클래스 그대로 사용해 HTML로 변환
function createTravelCardHtml(place) {
  const rating = typeof place.avgStar === "number" ? place.avgStar.toFixed(1) : "0.0";
  const reviewCount = place.reviewCount ?? 0;
  const name = escapeHtml(place.pName ?? "");
  const address = escapeHtml(place.address ?? "");
  const description = escapeHtml(place.body ?? "");

  // TODO: place_img 테이블 연동 전이라 임시 이미지를 사용 중. 이미지 API 연결 시 교체 필요.
  const imageUrl = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80";

  return `
    <article class="travel-card">
      <a href="./travel-detail?id=${place.id}" class="card-image-link" aria-label="${name} 상세보기">
        <img src="${imageUrl}" alt="${name}" />
        <span class="rating">⭐ ${rating}</span>
      </a>
      <div class="card-body">
        <h2>${name}</h2>
        <p class="location">${address}</p>
        <p class="description">${description}</p>
        <div class="card-bottom">
          <span>리뷰 ${reviewCount}</span>
          <a href="./travel-detail?id=${place.id}">상세보기 →</a>
        </div>
      </div>
    </article>
  `;
}

// 검색 결과(장소명/주소/설명)에 HTML 태그가 섞여 들어오는 것을 방지하기 위한 최소한의 escape
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

initSearchArea();