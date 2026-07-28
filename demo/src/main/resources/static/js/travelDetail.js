
const params = new URLSearchParams(window.location.search)
const placeId = params.get('id')
const $ = (selector) => document.querySelector(selector);

let place = null;

console.log(placeId)

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
    $(`#place-reviewCount`).textContent = `${place.reviewCount}件のレビュー`;
    $(`#detail-avgStar`).textContent = place.avgStar.toFixed(2);
    $(`#detail-operatingHours`).textContent = place.operatingHours;
    $(`#detail-recommendSchedule`).textContent = place.recommendedSchedule;
    // place 테이블에 place_img 연결 및 Place Entity 관련 추가 필요
}
// 리뷰 연결 필요

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
            visitDate: visitDateTime
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
loadPlaceDetail(placeId);