// travel-detail.html과 schedule.html 상세 모달이 함께 쓰는 렌더 함수
export function renderPlaceDetail(place, options = {}) {
  const { showMap = true } = options;

  return `
    <section class="detail-hero">
      <img src="${place.imageUrl ?? '/images/default-place.jpg'}" alt="${place.pName}" />
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1>${place.pName}</h1>
        <p>⌖ ${place.address}</p>
      </div>
    </section>

    <section class="content-wrap">
      <article class="info-card">
        <h2>소개</h2>
        <p>${place.body ?? ''}</p>
      </article>

      ${showMap ? `
        <article class="map-card">
          <h2>위치</h2>
          <div id="place-map-${place.id}" class="place-map"></div>
        </article>
      ` : ''}

      <article class="travel-info-card">
        <h2>여행 정보</h2>
        <div class="travel-info-row">
          <span class="info-icon">▦</span>
          <div>
            <strong>운영 시간</strong>
            <p>${place.operatingHours ?? '정보 없음'}</p>
          </div>
        </div>
        <div class="travel-info-row">
          <span class="info-icon">₩</span>
          <div>
            <strong>추천 일정</strong>
            <p>${place.recommendedSchedule ?? '정보 없음'}</p>
          </div>
        </div>
        <button type="button" class="schedule-btn">일정에 추가하기</button>
      </article>
    </section>
  `;
}

// showMap이 true일 때 지도 초기화 (naver.maps.Map은 innerHTML만으론 안 그려지므로 별도 호출 필요)
export function initPlaceMap(place) {
  const el = document.getElementById(`place-map-${place.id}`);
  if (!el) return;
  const map = new naver.maps.Map(el, {
    center: new naver.maps.LatLng(place.pLocationLat, place.pLocationLng),
    zoom: 15
  });
  new naver.maps.Marker({ position: map.getCenter(), map });
}