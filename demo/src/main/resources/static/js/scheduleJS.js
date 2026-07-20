// schedule.html 전용 스크립트 (classic script — naver.maps 전역 객체를 그대로 씀)
// - 네이버 지도 + 주소 검색
// - 달력 렌더링
// - /api/plans 연동 (조회 / 추가·수정은 모달 팝업 / 삭제)
 
// ===================== 네이버 지도 + 검색 =====================
 
document.addEventListener('DOMContentLoaded', function () {
  var map = new naver.maps.Map('map', {
    center: new naver.maps.LatLng(37.5665, 126.9780),
    zoom: 15,
    minZoom: 1,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: naver.maps.MapTypeControlStyle.BUTTON,
      position: naver.maps.Position.TOP_LEFT
    },
    zoomControl: true,
    zoomControlOptions: {
      position: naver.maps.Position.TOP_RIGHT
    }
  });
 
  var marker = new naver.maps.Marker({
    position: map.getCenter(),
    map: map
  });
 
  var infowindow = new naver.maps.InfoWindow({
    anchorSize: new naver.maps.Size(15, 5),
    pixelOffset: new naver.maps.Point(0, -10)
  });
 
  function searchAddress() {
    var query = document.getElementById('searchInput').value;
    if (!query) return;
 
    naver.maps.Service.geocode({ query: query }, function (status, response) {
      if (status !== naver.maps.Service.Status.OK) {
        alert('검색 결과가 없습니다.');
        return;
      }
 
      var result = response.v2.addresses[0];
      if (!result) {
        alert('검색 결과가 없습니다.');
        return;
      }
 
      var point = new naver.maps.LatLng(result.y, result.x);
 
      map.setCenter(point);
      map.setZoom(17);
      marker.setPosition(point);
 
      infowindow.setContent(
        '<div style="padding:10px;">' +
        '<h4>' + query + '</h4>' +
        '<p>' + (result.roadAddress || result.jibunAddress) + '</p>' +
        '</div>'
      );
      infowindow.open(map, marker);
    });
  }
 
  document.getElementById('searchBtn').addEventListener('click', searchAddress);
  document.getElementById('searchInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') searchAddress();
  });
});
 
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
    const res = await fetch(`/api/plans?date=${selectedDateStr()}`);
    if (!res.ok) throw new Error('일정을 불러오지 못했습니다.');
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
  return `${selectedDateStr()}T${timeStr}:00`;
}
 
// ===== 일정 추가/수정 모달 =====
 
function openPlanModal(mode, plan) {
  editingId = (mode === 'edit') ? plan.id : null;
 
  document.getElementById('planModalTitle').textContent = (mode === 'edit') ? '일정 수정' : '일정 추가';
  document.getElementById('planTitleInput').value = (mode === 'edit') ? (plan.pName ?? '') : '';
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
    alert('제목을 입력해주세요.');
    return;
  }
  if (!startTime || !endTime) {
    alert('시작/종료 시간을 입력해주세요.');
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
      ? await fetch(`/api/plans/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      : await fetch('/api/plans', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
 
    if (!res.ok) throw new Error(editingId ? '수정에 실패했습니다.' : '일정 추가에 실패했습니다.');
 
    closePlanModal();
    await loadPlans();
  } catch (err) {
    alert(err.message);
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
 
  if (!confirm('이 일정을 삭제할까요?')) return;
 
  try {
    const res = await fetch(`/api/plans/${id}`, { method: 'DELETE' });
    if (!res.ok && res.status !== 204) throw new Error('삭제에 실패했습니다.');
    await loadPlans();
  } catch (err) {
    alert(err.message);
  }
}
 
document.addEventListener('DOMContentLoaded', () => {
  renderCalendar();
  loadPlans();
 
  const addBtn = document.getElementById('addPlanBtn');
  if (addBtn) addBtn.addEventListener('click', () => openPlanModal('add'));
 
  document.getElementById('planCancelBtn').addEventListener('click', closePlanModal);
  document.getElementById('planSaveBtn').addEventListener('click', onSavePlan);
 
  // 모달 바깥(어두운 배경) 클릭 시 닫기
  document.getElementById('planModalOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'planModalOverlay') closePlanModal();
  });
});
 