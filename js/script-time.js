// TimeZoneDB API configuration
const API_KEY = 'MQ5MI9TCCHXJ'; // Your TimeZoneDB key
const BASE_URL = 'https://api.timezonedb.com/v2.1/get-time-zone';

// DOM elements
const tzInput       = document.getElementById('timezoneInput');
const getTimeBtn    = document.getElementById('getTimeBtn');
const currentTimeEl = document.getElementById('currentTime');

getTimeBtn.addEventListener('click', () => {
  const tz = tzInput.value.trim();
  if (!tz) {
    alert('Please enter a valid timezone (e.g., Asia/Kuala_Lumpur).');
    return;
  }
  fetchTime(tz);
});

function fetchTime(timezone) {
  // Real API URL
  const realUrl = `${BASE_URL}?key=${API_KEY}&format=json&by=zone&zone=${encodeURIComponent(timezone)}`;
  // Proxy through AllOrigins to bypass CORS
  const url     = `https://api.allorigins.win/raw?url=${encodeURIComponent(realUrl)}`;

  console.log('Request URL:', url);

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network error: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('API response:', data);
      if (data.status !== 'OK') {
        throw new Error(data.message || 'Error fetching time data');
      }
      // Render the result
      currentTimeEl.innerHTML = `
        <h3>${data.zoneName}</h3>
        <p><strong>Country:</strong> ${data.countryName || data.countryCode || 'N/A'}</p>
        <p><strong>UTC Offset:</strong> ${data.gmtOffset / 3600} hours</p>
        <p><strong>Current Time:</strong> ${data.formatted}</p>
      `;
    })
    .catch(err => {
      console.error('Fetch error:', err);
      currentTimeEl.innerHTML = `<p class="text-danger">Error: ${err.message}</p>`;
    });
}

// Optional: load a default timezone on page load
fetchTime('Asia/Kuala_Lumpur');
