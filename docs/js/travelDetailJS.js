const $ = (selector) => document.querySelector(selector);
const $$ = (selector)=> document.querySelectorAll(selector);
const params = new URLSearchParams(window.location.search);
const placeId = params.get('id');

let place = null;

console.log(placeId)

function NotIdException(placeId) {
    if (!placeId) {
        openModal('間違った接近です。');
        window.location.href = 'travel-list';
    } else {
        loadPlaceDetail(placeId)
    }
}
// 여행지 id 별 세부 내역 받아오기
async function loadPlaceDetail(placeId) {
    try {
        const res = await fetch(`${API_BASE}/api/places/${placeId}`, { credentials: 'include' });

        if (!res.ok) {
            throw new Error(`サーバー応答エラー: ${res.status}`);
        }

        place = await res.json();
        console.log(place);

        renderPlaceDetail(place);
    } catch (err) {

        console.error('存在しない旅行先です。', err);
        openModal('存在しない旅行先です。');
        window.location.href = 'travel-list';
    }
}
// 여행지 세부 내용 렌더링
function renderPlaceDetail(place) {
    $(`#detail-pName`).textContent = place.pName;
    $(`#detail-address`).textContent = place.address;
    $(`#detail-body`).textContent = place.body;
    renderPlaceImg(place.imgUrl);
    $(`#place-reviewCount`).textContent = `${place.reviewCount}件のレビュー`;
    $(`#detail-avgStar`).textContent = place.avgStar.toFixed(2);
    $(`#detail-operatingHours`).textContent = place.operatingHours;
    $(`#detail-recommendSchedule`).textContent = place.recommendedSchedule;

    // getStarString 함수 이용하여 리뷰 수만큼 별 그려주기
    $(`.stars`).textContent = getStarString(place.avgStar);
}
    // 리뷰 평균만큼 별 그려주는 함수
    function getStarString(rating) {
        const starCount = Math.round(rating);
        const emptyCount = 5 - starCount;
        return '★'.repeat(starCount) + '☆'.repeat(emptyCount);
    }

    // 리뷰 하나씩 만들기
    function createReviewHtml (review) {
        const starString = getStarString(review.star);
        const YMDOnly = review.createdAt.split('T');

        return `
            <div class="review-item">
            <div class="review-user-icon">●</div>
            <div class="review-content">
              <div class="review-meta">
                <strong>${escapeHtml(review.username)}</strong>
                <div>
                  <span class="small-stars">${starString}</span>
                  <time datetime="${review.createdAt}">${YMDOnly[0]}</time>
                </div>
              </div>
              <p>${escapeHtml(review.body)}</p>
            </div>
          </div>
        `
    }

    function renderReviews(reviews) {
        const reviewList = $(`#review-list`)

        if (!reviews || reviews.length === 0) {
            reviewList.innerHTML = '<p>まだ投稿したレビューがありません。</p>'
            return
        }
        reviewList.innerHTML = reviews.map(createReviewHtml).join('');
    }

    function renderPlaceImg(imageUrl) {
        const defaultImage = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80';
        $('#detail-imgUrl').src = imageUrl ?? defaultImage;
    }

    // 리뷰 받아오기
    async function loadPlaceReview(placeId) {
        try {
            const res = await fetch(`${API_BASE}/api/places/${placeId}/reviews`, { credentials: 'include' });

            if (!res.ok) {
                throw new Error(`レビュー照会失敗: ${res.status}`);
            }

            const data = await res.json();

            renderReviews(data);

        } catch (err) {
            console.error('レビューを読み込めませんでした。', err);
            openModal('レビューを読み込めません。');
        }
    }

    // 리뷰 등록 시 별에 hover 할 경우 별 갯수 변경되게
    let selectedRating = 0;
    const starElements = $$(`#review-rating .star`)

    starElements.forEach((star) => {
        star.addEventListener('mouseenter', () => {
            const hoverValue = Number(star.dataset.value);
            updateStarDisplay(hoverValue);
        });
        star.addEventListener('mouseleave', () => {
            updateStarDisplay(selectedRating);
        });
        star.addEventListener('click', () => {
            selectedRating = Number(star.dataset.value);
            updateStarDisplay(selectedRating);
        });
    });

    function updateStarDisplay(rating) {
        starElements.forEach((star) => {
            const starValue = Number(star.dataset.value);
            star.textContent = starValue <= rating ? '★' : '☆';
        });
    }

    $('#review-button').addEventListener('click', () => {
        if (selectedRating === 0) {
            openModal('星評価を選択してください。');
            return;
        }

        // 버튼 클릭 시 review에 post 보내기
        const reviewContent = $(`#review-body`).value;

        fetch(`${API_BASE}/api/places/${placeId}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({ star: selectedRating, body: reviewContent})
        })
            .then(res => {
                if (res.status === 401) throw new Error('レビューを投稿するにはログインが必要です。');
                if (!res.ok) throw new Error('レビュー投稿に失敗しました。');

                openModal('レビュー投稿成功！');

                loadPlaceReview(placeId);
                loadPlaceDetail(placeId);
                $('#review-body').value = '';
                selectedRating = 0;
                updateStarDisplay(0);
            })
            .catch(err => {
                console.error(err);
                openModal(err.message);
            })
    });

// 일정에 추가 버튼 눌렀을 때 기능
function addSchedule() {
    if (!place) {
        openModal("旅行先の情報を読み込めませんでした。")
        return
    }

    const startDate = prompt('訪問日を入力してください。(例: 2026-08-15)');
    if (!startDate) return;

    const visitDateTime = `${startDate}T00:00:00`;

    fetch(`${API_BASE}/api/plans`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({
            placeId: place.id,
            pName: place.pName,
            pLocationLat: place.pLocationLat,
            pLocationLng: place.pLocationLng,
            startDate: visitDateTime,
            endDate: visitDateTime
        })
    })
        .then(res =>{
            if (!res.ok) throw new Error("日程追加失敗")
            openModal('日程に追加されました！')
        })
        .catch(err => {
            console.error(err);
            openModal('日程の追加中にエラーが発生しました。')
        });
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// 모달창 복붙
function openModal(message) {
    $(`#modal-message`).textContent = message;
    document.getElementById("modalOverlay").classList.add("open");
}
function closeModal() {
    document.getElementById("modalOverlay").classList.remove("open");
}

$('#confirmBtn').addEventListener('click', closeModal);

$(`.schedule-btn`).addEventListener('click', addSchedule);


NotIdException(placeId);
loadPlaceReview(placeId);