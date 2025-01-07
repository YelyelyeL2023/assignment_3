let map;
weather();

async function weather() {
  const city = document.getElementById('cityInput').value || 'London';
  try {
    let weatherRes = await fetch(`/weather?city=${city}`);
    let weatherData = await weatherRes.json();
    document.getElementById('weather').innerHTML = `
      <div class="weather-info">
        <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png" alt="Weather Icon" />
        <div>
          <h2>${weatherData.name}</h2>
          <p>${weatherData.weather[0].main} (${weatherData.weather[0].description})</p>
          <p>${weatherData.main.temp}°C</p>
          <p>Humidity: ${weatherData.main.humidity}%</p>
        </div>
      </div>
    `;

    if (!map) {
      map = L.map('map').setView([weatherData.coord.lat, weatherData.coord.lon], 6);
    } else {
      map.setView([weatherData.coord.lat, weatherData.coord.lon], 6);
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });
    }

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);
    L.marker([weatherData.coord.lat, weatherData.coord.lon]).addTo(map);
  } catch (error) {
    console.error(error);
  }
}



document.getElementById('getWeatherBtn').addEventListener('click', weather);
document.getElementById('cityInput').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    weather();
  } 
});