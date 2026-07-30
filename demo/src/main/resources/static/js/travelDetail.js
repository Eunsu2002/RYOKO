
const $ = (selector) => document.querySelector(selector);
const params = new URLSearchParams(window.location.search);
const placeId = params.get('id');

let place = null;

console.log(placeId)

function NotIdException(placeId) {
    if (!placeId) {
        alert('잘못된 접근입니다.');
        window.location.href = 'travel-list.html';
    } else {
        loadPlaceDetail(placeId)
    }
}

async function loadPlaceDetail(placeId) {

    try {
        const res = await fetch(`/api/places/${placeId}`);

        if (!res.ok) {
            throw new Error(`서버 응답 에러: ${res.status}`);
        }

        place = await res.json();
        console.log(place);

        renderPlaceDetail(place);
    } catch (err) {

        console.error('여행지 정보를 불러오지 못했습니다.', err);
        alert('존재하지 않는 여행지입니다.')
        window.location.href = 'travel-list.html';
    }
}
// 렌더링
function renderPlaceDetail(place) {
    $(`#detail-pName`).textContent = place.pName;
    $(`#detail-address`).textContent = place.address;
    $(`#detail-body`).textContent = place.body;
    $(`#place-reviewCount`).textContent = `${place.reviewCount}件のレビュー`;
    $(`#detail-avgStar`).textContent = place.avgStar.toFixed(2);
    $(`#detail-operatingHours`).textContent = place.operatingHours;
    $(`#detail-recommendSchedule`).textContent = place.recommendedSchedule;
    // place 테이블에 place_img 연결 및 Place Entity 관련 추가 필요

    // 리뷰 평균만큼 별 그려주기
    const starCount = Math.round(place.avgStar);
    const emptyCount = 5 - starCount;
    $(`.stars`).textContent = '★'.repeat(starCount) + '☆'.repeat(emptyCount)
        }

    // 리뷰 등록 시 별에 hover 할 경우 별 갯수 변경되게
    let selectedRating = 0;
    const starElements = $(`#review-rating .star`)

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
            alert('星評価を選択してください。');
            return;
        }
        // 버튼 클릭 시 review에 post 보내기
        const reviewContent = $(`.review-content`)

        fetch(`api/review/{id}`), {
            method: 'POST',
            header: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ rating: selectedRating, content: reviewContent})
        }
            .then(res => {
                if (!res.ok) throw new Error('レビュー投稿成功');
                alert('レビュー投稿失敗')
            })
            .catch(err => console.error(err))
        
    })



// 리뷰 연결 필요
function renderReview(review){

}

// 일정에 추가 버튼 눌렀을 때 기능
function addSchedule() {
    if (!place) {
        alert("旅行先の情報を読み込めませんでした。")
        return
    }

    const startDate = prompt('訪問日を入力してください。(예: 2026-08-15)');
    if (!startDate) return;

    const visitDateTime = `${startDate}T00:00:00`;

    fetch('/api/plans', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
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
            alert('日程に追加されました！')
        })
        .catch(err => {
            console.error(err);
            alert('日程の追加中にエラーが発生しました。')
        });
}

$(`.schedule-btn`).addEventListener('click', addSchedule);
NotIdException(placeId)
