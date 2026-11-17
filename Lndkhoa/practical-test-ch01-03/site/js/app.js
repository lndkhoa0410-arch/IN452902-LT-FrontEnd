// Câu 2: viết JavaScript tại đây

const API_URL = 'http://localhost:4000';

// Hàm có sẵn: đổi giờ UTC sang giờ Việt Nam, vd "08:00 12/09/2026"
const formatDateTime = (iso) =>
  new Date(iso).toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit', minute: '2-digit',
    day: '2-digit', month: '2-digit', year: 'numeric',
  });

// ---------- Câu 2a: định dạng số chỗ ----------
const formatSeats = (event) => {
  const remaining = event.capacity - event.registeredCount;
  return remaining > 0 ? `Còn ${remaining}/${event.capacity} chỗ` : 'Hết chỗ';
};

// ---------- Câu 2b: vẽ danh sách card ----------
const createEventCard = (event) => {
  const article = document.createElement('article');
  article.className = 'card';

  const img = document.createElement('img');
  img.setAttribute('src', 'img/event.svg');
  img.setAttribute('alt', `Minh hoạ sự kiện ${event.name}`);
  img.setAttribute('width', '320');
  img.setAttribute('height', '180');

  const body = document.createElement('div');
  body.className = 'card-body';

  const h2 = document.createElement('h2');
  const link = document.createElement('a');
  link.setAttribute('href', `event-detail.html?id=${encodeURIComponent(event.id)}`);
  link.textContent = event.name;
  h2.append(link);

  const pTime = document.createElement('p');
  const time = document.createElement('time');
  time.setAttribute('datetime', event.startTime);
  time.textContent = formatDateTime(event.startTime);
  pTime.append(time);

  const pLocation = document.createElement('p');
  pLocation.textContent = event.location;

  const pSeats = document.createElement('p');
  const seatsText = formatSeats(event);
  if (seatsText === 'Hết chỗ') {
    const badge = document.createElement('span');
    badge.className = 'badge-full';
    badge.textContent = seatsText;
    pSeats.append(badge);
  } else {
    pSeats.textContent = seatsText;
  }

  body.append(h2, pTime, pLocation, pSeats);
  article.append(img, body);
  return article;
};

const renderEvents = (events) => {
  const list = document.querySelector('#event-list');
  list.replaceChildren(...events.map(createEventCard));
};

// ---------- Câu 2c: gọi API ----------
const statusEl = document.querySelector('#status');

const loadEvents = async (keyword = '') => {
  const params = new URLSearchParams({ pageSize: '50' });
  if (keyword !== '') params.set('q', keyword);

  statusEl.textContent = 'Đang tải…';
  try {
    const response = await fetch(`${API_URL}/api/events?${params}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    renderEvents(data.items);
    statusEl.textContent = data.items.length === 0
      ? 'Không có sự kiện nào khớp từ khoá.'
      : `Tìm thấy ${data.totalCount} sự kiện`;
  } catch (error) {
    console.error(error);
    statusEl.textContent = 'Không tải được dữ liệu, vui lòng thử lại.';
  }
};

document.querySelector('#search-form').addEventListener('submit', (e) => {
  e.preventDefault();
  loadEvents(document.querySelector('#keyword').value.trim());
});

loadEvents();
