// schedule.html 전용 스크립트 (classic script — naver.maps 전역 객체를 그대로 씀)
// - 네이버 지도 + 주소 검색
// - 달력 렌더링
// - /api/plans 연동 (조회 / 추가·수정은 모달 팝업 / 삭제)
 
import { renderPlaceDetail } from './placeDetailRenderer.js';

// ===================== 네이버 지도 + 검색 =====================
 
let map;
let currentPopup = null; // 지도 위 place-popup InfoWindow (한 번에 하나만)

document.addEventListener('DOMContentLoaded', function () {
  map = new naver.maps.Map('map', {
    center: new naver.maps.LatLng(37.5665, 126.9780),
    zoom: 15,
    minZoom: 1,
    mapTypeControl: false,
    zoomControl: false
  });

  document.getElementById('searchBtn').addEventListener('click', searchPlaces);
  document.getElementById('searchInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') searchPlaces();
  });
});

// ===== DB 검색 (기존 geocode 검색 대체) =====

async function searchPlaces() {
  const keyword = document.getElementById('searchInput').value.trim();
  const box = document.getElementById('searchResultBox');

  if (!keyword) {
    box.innerHTML = '';
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/places?keyword=${encodeURIComponent(keyword)}`);
    if (!res.ok) throw new Error('検索に失敗しました。');
    const data = await res.json();
    const places = data.content ?? data;

    if (!places || places.length === 0) {
      box.innerHTML = '<li class="search-empty">検索結果がありません。</li>';
      return;
    }

    box.innerHTML = places.map(p => `
      <li class="search-result-item" data-id="${p.id}">
        📍 ${p.pName}
        <span class="addr">${p.address}</span>
      </li>
    `).join('');

    box.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const place = places.find(p => p.id === Number(item.dataset.id));
        if (place) selectPlace(place);
        box.innerHTML = '';
        document.getElementById('searchInput').value = place.pName;
      });
    });
  } catch (err) {
    box.innerHTML = `<li class="search-empty">${err.message}</li>`;
  }
}

// ===== 지도 위 place-popup 카드 =====

// ===== featured-card (선택한 여행지 카드) =====

let selectedPlaceId = null; // featured-card에 현재 표시 중인 여행지 id

// 선택 전: 안내 문구 표시 (여행지 미선택 상태)
function renderFeaturedPlaceholder() {
  selectedPlaceId = null;
  const card = document.getElementById('featuredCard');
  if (card) card.style.display = 'none';
  const ph = document.getElementById('featuredPlaceholder');
  if (ph) ph.style.display = 'flex';
}

// 선택 후: featured-card에 여행지 정보 채우기
function renderFeaturedCard(place) {
  selectedPlaceId = place.id;

  const ph = document.getElementById('featuredPlaceholder');
  if (ph) ph.style.display = 'none';

  const card = document.getElementById('featuredCard');
  if (card) card.style.display = 'flex';

  const defaultImg = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80';
  document.getElementById('featuredImg').src = place.imgUrl ?? defaultImg;
  document.getElementById('featuredTitle').textContent = place.pName;
  document.getElementById('featuredLoc').textContent = '📍 ' + place.address;
  document.getElementById('featuredDesc').textContent = place.body ?? '';
  const count = place.reviewCount ?? 0;
  document.getElementById('featuredReview').textContent = `⭐ レビュー ${count}`;
}

function selectPlace(place) {
  const position = new naver.maps.LatLng(place.pLocationLat, place.pLocationLng);
  map.setCenter(position);
  map.setZoom(16);

  if (currentPopup) currentPopup.close();

  const content = `
    <div class="place-popup">
      <div class="popup-body">
        <h4>${place.pName}</h4>
        <p class="popup-sub">${place.address}</p>
      </div>
    </div>
  `;

  currentPopup = new naver.maps.InfoWindow({
    content,
    borderWidth: 0,
    backgroundColor: 'transparent',
    disableAnchor: true,
    pixelOffset: new naver.maps.Point(0, -10)
  });

  currentPopup.open(map, position);

  // 선택한 여행지를 featured-card에 채움
  renderFeaturedCard(place);
}

// ===== 상세 모달 =====

async function openDetailModal(placeId) {
  const res = await fetch(`${API_BASE}/api/places/${placeId}`);
  if (!res.ok) { showModal('詳細情報を読み込めませんでした。'); return; }
  const place = await res.json();

  document.getElementById('detailModalContent').innerHTML = renderPlaceDetail(place, { showMap: false });
  document.getElementById('detailModalOverlay').classList.add('open');

  document.querySelector('#detailModalContent .schedule-btn')?.addEventListener('click', () => {
    closeDetailModal();
    openPlanModal('add', null, { pName: place.pName });
  });
}

function closeDetailModal() {
  document.getElementById('detailModalOverlay').classList.remove('open');
}
 
// ===================== 달력 =====================
 
const monthNames = [
  '1月', '2月', '3月', '4月', '5月', '6月',
  '7月', '8月', '9月', '10月', '11月', '12月',
];
 
let currentDate = new Date();          // 달력에 표시 중인 연월
let selectedYear = currentDate.getFullYear();
let selectedMonth = currentDate.getMonth();
let selectedDay = currentDate.getDate(); // 선택된 날짜 (기본값: 오늘)
 
function pad2(n) {
  return String(n).padStart(2, '0');
}
 
// 선택된 날짜를 API가 기대하는 'YYYY-MM-DD' 형식으로 반환
function selectedDateStr() {
  return `${selectedYear}-${pad2(selectedMonth + 1)}-${pad2(selectedDay)}`;
}
 
function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();
 
  document.getElementById('calTitle').textContent = `${year}年 ${monthNames[month]}`;
 
  const grid = document.getElementById('calGrid');
  grid.innerHTML = '';
 
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
 
  for (let i = firstDay - 1; i >= 0; i--) {
    const cell = document.createElement('div');
    cell.className = 'cal-day other';
    cell.textContent = daysInPrev - i;
    grid.appendChild(cell);
  }
 
  for (let d = 1; d <= daysInMonth; d++) {
    const dow = new Date(year, month, d).getDay();
 
    const cell = document.createElement('div');
    let cls = 'cal-day';
    if (dow === 0) cls += ' sun';
    if (dow === 6) cls += ' sat';
 
    if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
      cls += ' today';
    } else if (d === selectedDay && month === selectedMonth && year === selectedYear) {
      cls += ' selected';
    }
 
    cell.className = cls;
    cell.textContent = d;
 
    cell.onclick = () => {
      selectedDay = d;
      selectedMonth = month;
      selectedYear = year;
      renderCalendar();
      loadPlans();
    };
 
    grid.appendChild(cell);
  }
 
  const remaining = 42 - grid.children.length;
  for (let i = 1; i <= remaining; i++) {
    const cell = document.createElement('div');
    cell.className = 'cal-day other';
    cell.textContent = i;
    grid.appendChild(cell);
  }
}
 
function changeMonth(dir) {
  currentDate.setMonth(currentDate.getMonth() + dir);
  renderCalendar();
}
// HTML의 onclick="changeMonth(-1)"에서 찾을 수 있도록 전역으로 노출
window.changeMonth = changeMonth;
 
// ===================== /api/plans 연동 =====================
 
let currentPlans = []; // 마지막으로 불러온 일정 목록 (편집 모달에 채워 넣을 때 씀)
let editingId = null;  // null이면 "추가" 모드, 값이 있으면 그 id를 "수정" 중
 
function fmtTime(isoString) {
  const d = new Date(isoString);
  let h = d.getHours();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  const m = pad2(d.getMinutes());
  return `${pad2(h)}:${m} ${ampm}`;
}
 
// "2026-07-20T09:00:00" -> "09:00" (time input에 채우기 위함)
function toTimeInputValue(isoString) {
  const d = new Date(isoString);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function toDateInputValue(dateTimeStr) {
  return dateTimeStr.split('T')[0]; // "2026-08-01T09:00:00" -> "2026-08-01"
}
 
function planCardHtml(plan) {
  const timeRange = (plan.startDate && plan.endDate)
    ? `${fmtTime(plan.startDate)} – ${fmtTime(plan.endDate)}`
    : '';
  const loc = (plan.locationLat != null && plan.locationLng != null)
    ? `${plan.locationLat}, ${plan.locationLng}`
    : 'Seoul, Korea';
 
  return `
    <div class="s-card" data-id="${plan.id}">
      <div class="s-card-actions">
        <button class="s-card-btn edit-btn" title="編集">✏️</button>
        <button class="s-card-btn delete-btn" title="削除">✕</button>
      </div>
      <div class="s-card-time">${timeRange}</div>
      <div class="s-card-title">${plan.pName ?? ''}</div>
      <div class="s-card-sub">${plan.memo ?? ''}</div>
      <div class="s-card-loc">📍 ${loc}</div>
    </div>
  `;
}
 
async function loadPlans() {
  const grid = document.getElementById('cardsGrid');
  if (!grid) return;
 
  grid.innerHTML = '<p class="schedule-empty">読み込み中...</p>';
 
  try {
    const res = await fetch(`${API_BASE}/api/plans?date=${selectedDateStr()}`);
    if (!res.ok) throw new Error('日程を読み込めませんでした。');
    const plans = await res.json();
    currentPlans = plans;
 
    if (plans.length === 0) {
      grid.innerHTML = '<p class="schedule-empty">この日の予定はまだありません。</p>';
      return;
    }
 
    grid.innerHTML = plans.map(planCardHtml).join('');
    grid.querySelectorAll('.edit-btn').forEach((btn) => btn.addEventListener('click', onEditClick));
    grid.querySelectorAll('.delete-btn').forEach((btn) => btn.addEventListener('click', onDeleteClick));
  } catch (err) {
    grid.innerHTML = `<p class="schedule-empty">${err.message}</p>`;
  }
}
 
// 선택된 날짜 + "HH:MM" 문자열 -> 백엔드가 받는 datetime 문자열
function buildDateTime(timeStr) {
  const dateStr = document.getElementById('planDateInput').value || selectedDateStr();
  return `${dateStr}T${timeStr}:00`;
}
 
// ===== 일정 추가/수정 모달 =====
 
function openPlanModal(mode, plan, prefill) {
  editingId = (mode === 'edit') ? plan.id : null;

  document.getElementById('planModalTitle').textContent = (mode === 'edit') ? '日程を編集' : '日程を追加';
  document.getElementById('planTitleInput').value =
    (mode === 'edit') ? (plan.pName ?? '') : (prefill?.pName ?? '');
  document.getElementById('planDateInput').value =
    (mode === 'edit') ? toDateInputValue(plan.startDate) : selectedDateStr();
  document.getElementById('planStartInput').value = (mode === 'edit') ? toTimeInputValue(plan.startDate) : '09:00';
  document.getElementById('planEndInput').value = (mode === 'edit') ? toTimeInputValue(plan.endDate) : '11:00';
  document.getElementById('planMemoInput').value = (mode === 'edit') ? (plan.memo ?? '') : '';

  document.getElementById('planModalOverlay').classList.add('open');
  document.getElementById('planTitleInput').focus();
}
 
function closePlanModal() {
  document.getElementById('planModalOverlay').classList.remove('open');
  editingId = null;
}
 
async function onSavePlan() {
  const pName = document.getElementById('planTitleInput').value.trim();
  const startTime = document.getElementById('planStartInput').value;
  const endTime = document.getElementById('planEndInput').value;
  const memo = document.getElementById('planMemoInput').value.trim();
 
  if (!pName) {
    showModal('タイトルを入力してください。');
    return;
  }
  if (!startTime || !endTime) {
    showModal('開始・終了時間を入力してください。');
    return;
  }
 
  const body = {
    pName,
    startDate: buildDateTime(startTime),
    endDate: buildDateTime(endTime),
    memo,
  };
 
  try {
    const res = editingId
      ? await fetch(`${API_BASE}/api/plans/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      : await fetch(`${API_BASE}/api/plans`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
 
    if (!res.ok) throw new Error(editingId ? '編集に失敗しました。' : '日程の追加に失敗しました。');
 
    closePlanModal();
    await loadPlans();
  } catch (err) {
    showModal(err.message);
  }
}
 
function onEditClick(e) {
  const card = e.target.closest('.s-card');
  const id = Number(card.dataset.id);
  const plan = currentPlans.find((p) => p.id === id);
  if (!plan) return;
  openPlanModal('edit', plan);
}
 
async function onDeleteClick(e) {
  const card = e.target.closest('.s-card');
  const id = card.dataset.id;
 
  if (!confirm('この日程を削除しますか？')) return;
 
  try {
    const res = await fetch(`${API_BASE}/api/plans/${id}`, { method: 'DELETE' });
    if (!res.ok && res.status !== 204) throw new Error('削除に失敗しました。');
    await loadPlans();
  } catch (err) {
    showModal(err.message);
  }
}
 
document.addEventListener('DOMContentLoaded', () => {
  renderCalendar();
  loadPlans();
  renderFeaturedPlaceholder(); // 처음엔 여행지 미선택 안내

  // featured-card의 '詳細を見る' → 선택된 여행지 상세 모달
  const featuredBtn = document.getElementById('featuredDetailBtn');
  if (featuredBtn) featuredBtn.addEventListener('click', () => {
    if (selectedPlaceId) openDetailModal(selectedPlaceId);
  });
 
  const addBtn = document.getElementById('addPlanBtn');
  if (addBtn) addBtn.addEventListener('click', () => openPlanModal('add'));
 
  document.getElementById('planCancelBtn').addEventListener('click', closePlanModal);
  document.getElementById('planSaveBtn').addEventListener('click', onSavePlan);
 
  // 모달 바깥(어두운 배경) 클릭 시 닫기
  document.getElementById('planModalOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'planModalOverlay') closePlanModal();
  });

  document.getElementById('detailModalCloseBtn').addEventListener('click', closeDetailModal);
  document.getElementById('detailModalOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'detailModalOverlay') closeDetailModal();
  });
});