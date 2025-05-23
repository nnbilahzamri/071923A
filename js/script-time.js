// WorldTimeAPI base URL
const TIMEAPI_BASE = 'https://worldtimeapi.org/api/timezone';

const tzInput = document.getElementById('timezoneInput');
const getTimeBtn = document.getElementById('getTimeBtn');
const currentTimeEl = document.getElementById('currentTime');

getTimeBtn.addEventListener('click', () => {
  const tz = tzInput.value.trim();
  if (!tz) return alert('Please enter a valid timezone.');
  fetchTime(tz);
});

function fetchTime(timezone) {
  fetch(`${TIMEAPI_BASE}/${encodeURIComponent(timezone)}`)
    .then(r => {
      if (!r.ok) throw new Error(`Timezone not found: ${r.statusText}`);
      return r.json();
    })
    .then(data => {
      currentTimeEl.innerHTML = `
        <h3>${data.timezone.replace('_', ' ')}</h3>
        <p><strong>UTC Offset:</strong> ${data.utc_offset}</p>
        <p><strong>Current Time:</strong> ${new Date(data.datetime).toLocaleString()}</p>
      `;
    })
    .catch(err => {
      currentTimeEl.innerHTML = `<p class="text-danger">Error: ${err.message}</p>`;
    });
}

// Optionally, load a default timezone on page load
fetchTime('Asia/Kuala_Lumpur');
