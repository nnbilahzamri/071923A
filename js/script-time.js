const tzInput = document.getElementById('timezoneInput');
const getTimeBtn = document.getElementById('getTimeBtn');
const currentTimeEl = document.getElementById('currentTime');

getTimeBtn.addEventListener('click', () => {
  const tz = tzInput.value.trim();
  if (!tz) return alert('Please enter a valid timezone (e.g., Asia/Kuala_Lumpur)');
  fetchTime(tz);
});

function fetchTime(timezone) {
  fetch(`https://timeapi.io/api/Time/current/zone?timeZone=${encodeURIComponent(timezone)}`)
    .then(r => {
      if (!r.ok) throw new Error(`Timezone not found: ${r.statusText}`);
      return r.json();
    })
    .then(data => {
      currentTimeEl.innerHTML = `
        <h3>${timezone.replace('_', ' ')}</h3>
        <p><strong>UTC Offset:</strong> ${data.utcOffset}</p>
        <p><strong>Current Time:</strong> ${data.date} ${data.time}</p>
      `;
    })
    .catch(err => {
      currentTimeEl.innerHTML = `<p class="text-danger">Error: ${err.message}</p>`;
    });
}

// Optional: Load default time on page load
fetchTime('Asia/Kuala_Lumpur');
