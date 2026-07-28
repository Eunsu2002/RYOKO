
const params = new URLSearchParams(window.location.search)
const placeId = params.get('id')
const $ = (selector) => document.querySelector(selector);

console.log(placeId)

// id 받아서 넣기
async function loadPlaceDetail(placeId) {
    try {
        const res = await fetch(`/api/places/${placeId}`);

        if (!res.ok) {
            throw new Error(`서버 응답 에러: ${res.status}`);
        }

        const place = await res.json();
        console.log(place);

        renderPlaceDetail(place);
    } catch (err) {
        console.error('여행지 정보를 불러오지 못했습니다.', err);
    }
}
// place 렌더링
function renderPlaceDetail(place) {
    $(`#detail-pName`).textContent = place.pName;
    $(`#detail-address`).textContent = place.address;
    $(`#detail-body`).textContent = place.body;
    $(`#detail-avgStar`).textContent = place.avgStar.toFixed(2);
    $(`#detail-operatingHours`).textContent = place.operatingHours;
    $(`#detail-recommendSchedule`).textContent = place.recommendedSchedule;
    // place 테이블에 place_img 연결 및 Place Entity 관련 추가 필요
}

// 리뷰 연결 필요


loadPlaceDetail(placeId);