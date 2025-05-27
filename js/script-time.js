// TimeZoneDB API configuration
const API_KEY = 'MQ5MI9TCCHXJ';
const BASE_URL = 'https://api.timezonedb.com/v2.1/get-time-zone';

// DOM elements
const tzInput = document.getElementById('timezoneInput');
const tzSelect = document.getElementById('timezoneSelect');
const getTimeBtn = document.getElementById('getTimeBtn');
const clockGrid = document.getElementById('currentTime');

// List of some common timezones
const timezones = [
  'Asia/Kuala_Lumpur', 'Asia/Singapore', 'Asia/Tokyo', 'Asia/Seoul',
  'Asia/Jakarta', 'Asia/Dubai', 'Europe/London', 'Europe/Berlin',
  'Europe/Paris', 'Europe/Moscow', 'America/New_York', 'America/Los_Angeles',
  'America/Toronto', 'Australia/Sydney', 'Australia/Perth'
];

// Populate dropdown
timezones.forEach(tz => {
  const opt = document.createElement('option');
  opt.value = tz;
  opt.textContent = tz;
  tzSelect.appendChild(opt);
});

// Event: Button click
getTimeBtn.addEventListener('click', () => {
  const manualInput = tzInput.value.trim();
  const selectedTz = tzSelect.value;
  const timezone = manualInput || selectedTz;

  if (!timezone) {
    alert('Please enter or select a timezone.');
    return;
  }

  fetchTime(timezone);
});

// Fetch time from TimeZoneDB API
function fetchTime(timezone) {
  const realUrl = `${BASE_URL}?key=${API_KEY}&format=json&by=zone&zone=${encodeURIComponent(timezone)}`;
  const url = `https://api.allorigins.win/raw?url=${encodeURIComponent(realUrl)}`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`Network error: ${res.statusText}`);
      return res.json();
    })
    .then(data => {
      if (data.status !== 'OK') throw new Error(data.message || 'Invalid response');

      renderClock(data);
    })
    .catch(err => {
      console.error('Error:', err);
      clockGrid.innerHTML = `<p class="text-danger">Error: ${err.message}</p>`;
    });
}

// Render clock block
function renderClock(data) {
  const id = data.zoneName.replace(/[\/\s]/g, '_');
  const offsetHrs = (data.gmtOffset / 3600).toFixed(1);
  const timeStr = data.formatted || new Date(data.timestamp * 1000).toLocaleString();

  clockGrid.innerHTML = `
    <div class="clock-box">
      <h3>${data.zoneName}</h3>
      <p><strong>Country:</strong> ${data.countryName}</p>
      <p><strong>UTC Offset:</strong> ${offsetHrs} hours</p>
      <p><strong>Current Time:</strong> ${timeStr}</p>
      <canvas id="analog_${id}" width="200" height="200"></canvas>
    </div>
  `;

  // Start analog clock
  const canvas = document.getElementById(`analog_${id}`);
  const ctx = canvas.getContext('2d');
  const radius = canvas.height / 2;

  function drawAnalogClock() {
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(radius, radius);

    // Clock face
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.95, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = radius * 0.05;
    ctx.stroke();

    // Hour marks
    ctx.font = radius * 0.15 + "px arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    for (let num = 1; num <= 12; num++) {
      const ang = num * Math.PI / 6;
      ctx.rotate(ang);
      ctx.translate(0, -radius * 0.85);
      ctx.rotate(-ang);
      ctx.fillText(num.toString(), 0, 0);
      ctx.rotate(ang);
      ctx.translate(0, radius * 0.85);
      ctx.rotate(-ang);
    }

    const nowUTC = new Date();
    const localTS = nowUTC.getTime() + (data.gmtOffset * 1000);
    const now = new Date(localTS);
    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();

    // Hour hand
    hour = hour % 12;
    hour = (hour * Math.PI / 6) +
           (minute * Math.PI / (6 * 60)) +
           (second * Math.PI / (360 * 60));
    drawHand(ctx, hour, radius * 0.5, radius * 0.07);

    // Minute hand
    minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
    drawHand(ctx, minute, radius * 0.8, radius * 0.07);

    // Second hand
    second = (second * Math.PI / 30);
    drawHand(ctx, second, radius * 0.9, radius * 0.02, '#e74c3c');

    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset again to avoid compound transformations
  }

  function drawHand(ctx, pos, length, width, color = '#333') {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    ctx.moveTo(0, 0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
  }

  drawAnalogClock();
  setInterval(drawAnalogClock, 1000);
}

// Load default clock
fetchTime('Asia/Kuala_Lumpur');
