// Replace with your own OpenWeatherMap API key
const apiKey = 'f0d7acca3e1503821e93451aeac62ea1';
const defaultCity = "Terengganu";

// Format UNIX time to local readable time
function formatTimeFromUnix(unix, timezoneOffset = 0) {
  const date = new Date((unix + timezoneOffset) * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

document.addEventListener("DOMContentLoaded", () => {
  fetchWeather(defaultCity);
});

document.getElementById("getWeatherBtn").addEventListener("click", () => {
  const city = document.getElementById("cityInput").value.trim();
  if (city) fetchWeather(city);
});

function fetchWeather(city) {
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  // Get forecast data
  fetch(forecastUrl)
    .then(response => response.json())
    .then(data => {
      updateCurrentWeather(data); // For temp, humidity, etc.
      updateHourlyForecast(data);
      updateDailyForecast(data);
    })
    .catch(err => console.error("Forecast API error:", err));

  // Get current data for sunrise/sunset
  fetch(currentUrl)
    .then(response => response.json())
    .then(data => {
      const timezoneOffset = data.timezone;
      document.getElementById("sunrise").textContent = formatTimeFromUnix(data.sys.sunrise, timezoneOffset);
      document.getElementById("sunset").textContent = formatTimeFromUnix(data.sys.sunset, timezoneOffset);
    })
    .catch(err => console.error("Current weather API error:", err));
}

function updateCurrentWeather(data) {
  document.getElementById("cityName").innerText = data.city.name;
  const current = data.list[0];
  document.getElementById("temperature").innerText = `${current.main.temp}°C`;
  document.getElementById("feelsLike").innerText = `${current.main.feels_like}°C`;
  document.getElementById("weatherDescription").innerText = current.weather[0].description;
  document.getElementById("humidity").innerText = `${current.main.humidity}%`;
  document.getElementById("windSpeed").innerText = `${current.wind.speed} km/h`;
}

function updateHourlyForecast(data) {
  const hourlyContainer = document.getElementById("hourlyForecast");
  hourlyContainer.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    const forecast = data.list[i];
    const time = new Date(forecast.dt_txt).getHours();
    hourlyContainer.innerHTML += `
      <div class="hour-box p-2 border rounded text-center bg-light">
        <p class="mb-1 fw-bold">${time}:00</p>
        <p class="mb-1">${forecast.main.temp}°C</p>
        <p class="mb-0 text-capitalize">${forecast.weather[0].main}</p>
      </div>`;
  }
}

function updateDailyForecast(data) {
  const dailyContainer = document.getElementById("dailyForecast");
  dailyContainer.innerHTML = "";

  const daily = {};
  data.list.forEach(entry => {
    const date = entry.dt_txt.split(" ")[0];
    if (!daily[date]) daily[date] = entry;
  });

  Object.entries(daily).slice(0, 5).forEach(([date, entry]) => {
    dailyContainer.innerHTML += `
      <div class="day-box p-2 border rounded text-center bg-light">
        <p class="mb-1 fw-bold">${date}</p>
        <p class="mb-1">${entry.main.temp}°C</p>
        <p class="mb-0 text-capitalize">${entry.weather[0].main}</p>
      </div>`;
  });
}
