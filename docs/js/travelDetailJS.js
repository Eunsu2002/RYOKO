// travel-detail.html 동적 데이터 로딩 스크립트
// - URL의 id 파라미터로 여행지 상세 API를 호출한다.
// - 응답 데이터로 페이지의 히어로, 소개, 리뷰, 여행정보를 채운다.
// - 별점 선택 UI와 리뷰 등록 기능을 처리한다.

let selectedRating = 0;
let currentTravelId = null;

document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    alert("旅行先IDが指定されていません。");
    return;
  }

  currentTravelId = Number(id);
  fetchTravelDetail(currentTravelId);
  initStarRating();
  initReviewForm();
});

// ─── API 호출: 여행지 상세 조회 ───
async function fetchTravelDetail(id) {
  try {
    const response = await fetch(`${API_BASE}/api/travels/` + id);

    if (!response.ok) {
      throw new Error("API 요청 실패: " + response.status);
    }

    const data = await response.json();
    renderDetail(data);
  } catch (error) {
    console.error(error);
    var main = document.querySelector("main");
    if (main) {
      main.innerHTML =
        '<p style="text-align:center;padding:60px 20px;color:#6b7280;">' +
        "旅行先情報を読み込めませんでした。</p>";
    }
  }
}

// ─── 페이지에 데이터 렌더링 ───
function renderDetail(data) {
  // 히어로 이미지
  var heroImg = document.querySelector(".detail-hero img");
  if (heroImg && data.imageUrl) {
    heroImg.src = data.imageUrl;
    heroImg.alt = data.name || "";
  }

  // 여행지 이름
  var heroTitle = document.querySelector(".hero-content h1");
  if (heroTitle) {
    heroTitle.textContent = data.name || "";
  }

  // 위치
  var heroLocation = document.querySelector(".hero-content p");
  if (heroLocation) {
    heroLocation.textContent = "⌖ " + (data.location || "");
  }

  // 페이지 타이틀
  if (data.name) {
    document.title = data.name + " | ようこそ";
  }

  // 소개 텍스트
  var infoText = document.querySelector(".info-card p");
  if (infoText) {
    infoText.textContent = data.description || "";
  }

  // 평균 별점
  var ratingValue = document.querySelector(".rating-summary strong");
  if (ratingValue) {
    var avg =
      typeof data.averageRating === "number"
        ? data.averageRating.toFixed(1)
        : "0.0";
    ratingValue.textContent = avg;
  }

  // 별 표시
  var starsDisplay = document.querySelector(".rating-summary .stars");
  if (starsDisplay) {
    starsDisplay.textContent = createStarText(data.averageRating || 0);
  }

  // 리뷰 수
  var reviewCountSpan = document.querySelector(".rating-summary div span");
  if (reviewCountSpan) {
    var count = data.reviewCount || 0;
    reviewCountSpan.textContent = count + "件のレビュー";
  }

  // 운영 시간
  var infoRows = document.querySelectorAll(".travel-info-row p");
  if (infoRows.length >= 1) {
    infoRows[0].textContent = data.operatingHours || "情報なし";
  }
  if (infoRows.length >= 2) {
    infoRows[1].textContent = data.recommendedSchedule || "情報なし";
  }

  // 리뷰 목록
  renderReviews(data.reviews || []);
}

// ─── 리뷰 목록 렌더링 ───
function renderReviews(reviews) {
  var reviewList = document.querySelector(".review-list");
  if (!reviewList) return;

  if (reviews.length === 0) {
    reviewList.innerHTML =
      '<p style="padding:20px 0;color:#9ca3af;font-size:14px;">まだレビューがありません。最初のレビューを書いてみてください！</p>';
    return;
  }

  var html = "";
  for (var i = 0; i < reviews.length; i++) {
    html += createReviewItemHtml(reviews[i]);
  }
  reviewList.innerHTML = html;
}

function createReviewItemHtml(review) {
  var name = escapeHtml(review.userName || "ゲスト");
  var content = escapeHtml(review.content || "");
  var date = review.createdAt ? review.createdAt.substring(0, 10) : "";
  var stars = createStarText(review.rating || 0);

  return (
    '<div class="review-item">' +
    '<div class="review-user-icon">●</div>' +
    '<div class="review-content">' +
    '<div class="review-meta">' +
    "<strong>" +
    name +
    "</strong>" +
    "<div>" +
    '<span class="small-stars">' +
    stars +
    "</span>" +
    '<time datetime="' +
    date +
    '">' +
    date +
    "</time>" +
    "</div>" +
    "</div>" +
    "<p>" +
    content +
    "</p>" +
    "</div>" +
    "</div>"
  );
}

// ─── 별점 선택 UI ───
function initStarRating() {
  var starContainer = document.getElementById("review-rating");
  if (!starContainer) return;

  starContainer.innerHTML = "";
  starContainer.style.cursor = "pointer";

  for (var i = 1; i <= 5; i++) {
    var star = document.createElement("span");
    star.textContent = "☆";
    star.dataset.value = i;
    star.style.fontSize = "22px";
    star.style.transition = "color 0.15s";
    starContainer.appendChild(star);
  }

  starContainer.addEventListener("click", function (e) {
    if (e.target.dataset.value) {
      selectedRating = Number(e.target.dataset.value);
      updateStarDisplay(starContainer, selectedRating);
    }
  });

  starContainer.addEventListener("mouseover", function (e) {
    if (e.target.dataset.value) {
      updateStarDisplay(starContainer, Number(e.target.dataset.value));
    }
  });

  starContainer.addEventListener("mouseout", function () {
    updateStarDisplay(starContainer, selectedRating);
  });
}

function updateStarDisplay(container, rating) {
  var stars = container.querySelectorAll("span");
  for (var i = 0; i < stars.length; i++) {
    if (i < rating) {
      stars[i].textContent = "★";
      stars[i].style.color = "#FFBA25";
    } else {
      stars[i].textContent = "☆";
      stars[i].style.color = "#d1d5db";
    }
  }
}

// ─── 리뷰 등록 ───
function initReviewForm() {
  var submitBtn = document.querySelector(".review-form button");
  if (!submitBtn) return;

  submitBtn.addEventListener("click", function () {
    var textarea = document.getElementById("review-content");
    var content = textarea ? textarea.value.trim() : "";

    if (selectedRating === 0) {
      alert("評価を選択してください。");
      return;
    }
    if (!content) {
      alert("レビュー内容を入力してください。");
      return;
    }

    submitReview(content);
  });
}

async function submitReview(content) {
  var submitBtn = document.querySelector(".review-form button");

  try {
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "投稿中...";
    }

    var response = await fetch(
      `${API_BASE}/api/travels/` + currentTravelId + "/reviews",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: selectedRating,
          content: content,
        }),
      }
    );

    if (!response.ok) {
      var errorData = await response.json();
      throw new Error(errorData.error || "投稿に失敗しました。");
    }

    // 성공: 페이지 새로고침으로 최신 데이터 반영
    alert("レビューが投稿されました！");
    window.location.reload();
  } catch (error) {
    console.error(error);
    alert(error.message);
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "レビューを投稿";
    }
  }
}

// ─── 유틸 함수 ───
function createStarText(rating) {
  var full = Math.round(rating);
  var text = "";
  for (var i = 0; i < 5; i++) {
    text += i < full ? "★" : "☆";
  }
  return text;
}

function escapeHtml(text) {
  var div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
