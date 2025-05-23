// Replace with your own OpenWeatherMap API key
const OPENWEATHER_APIKEY = 'f0d7acca3e1503821e93451aeac62ea1';

// Elements
const cityInput = document.getElementById('cityInput');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const currentWeatherEl = document.getElementById('currentWeather');
const forecastCtx = document.getElementById('forecastChart').getContext('2d');

let forecastChart;  // Chart.js instance

getWeatherBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (!city) return alert('Please enter a city name.');
  fetchCurrentWeather(city);
  fetchForecast(city);
});

function fetchCurrentWeather(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_APIKEY}&units=metric`)
    .then(r => r.json())
    .then(data => {
      if (data.cod !== 200) throw new Error(data.message);
      currentWeatherEl.innerHTML = `
        <h3>${data.name}, ${data.sys.country}</h3>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
        <p>${data.main.temp.toFixed(1)}°C — ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}% | Wind: ${data.wind.speed} m/s</p>
      `;
    })
    .catch(err => {
      currentWeatherEl.innerHTML = `<p class="text-danger">Error: ${err.message}</p>`;
    });
}

function fetchForecast(city) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_APIKEY}&units=metric`)
    .then(r => r.json())
    .then(data => {
      if (data.cod !== "200") throw new Error(data.message);
      // Extract next 5 days at 12:00
      const daily = {};
      data.list.forEach(item => {
        if (item.dt_txt.includes('12:00:00')) {
          const date = item.dt_txt.split(' ')[0];
          daily[date] = item.main.temp;
        }
      });
      const labels = Object.keys(daily);
      const temps  = Object.values(daily);
      renderForecastChart(labels, temps);
    })
    .catch(err => {
      if (forecastChart) forecastChart.destroy();
      alert('Forecast error: ' + err.message);
    });
}

function renderForecastChart(labels, data) {
  if (forecastChart) forecastChart.destroy();
  forecastChart = new Chart(forecastCtx, {
    type: 'line',
    data: { labels, datasets: [{ label: 'Temp (°C)', data, tension: 0.3 }] },
    options: {
      scales: { y: { beginAtZero: false } },
      plugins: { legend: { display: false } }
    }
  });
}
