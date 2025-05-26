const API_KEY = 'MQ5MI9TCCHXJ'; // Replace this with your TimeZoneDB key
const BASE_URL = 'https://api.timezonedb.com/v2.1/get-time-zone';

const tzInput = document.getElementById('timezoneInput');
const getTimeBtn = document.getElementById('getTimeBtn');
const currentTimeEl = document.getElementById('currentTime');

getTimeBtn.addEventListener('click', () => {
  const tz = tzInput.value.trim();
  if (!tz) {
    alert('Please enter a valid timezone (e.g., Asia/Kuala_Lumpur)');
    return;
  }
  fetchTime(tz);
});

function fetchTime(timezone) {
  const url = `${BASE_URL}?key=${API_KEY}&format=json&by=zone&zone=${encodeURIComponent(timezone)}`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('Timezone not found');
      return response.json();
    })
    .then(data => {
      if (data.status !== 'OK') throw new Error(data.message || 'Error fetching time');
      currentTimeEl.innerHTML = `
        <h3>${data.zoneName}</h3>
        <p><strong>Country:</strong> ${data.countryName}</p>
        <p><strong>UTC Offset:</strong> ${data.gmtOffset / 3600} hours</p>
        <p><strong>Current Time:</strong> ${data.formatted}</p>
      `;
    })
    .catch(err => {
      currentTimeEl.innerHTML = `<p class="text-danger">Error: ${err.message}</p>`;
    });
}

// Load default timezone
fetchTime('Asia/Kuala_Lumpur');
