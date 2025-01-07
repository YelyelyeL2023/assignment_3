let map;
weather();

async function weather() {
  const city = document.getElementById('cityInput').value || 'London';
  try {
    let weatherRes = await fetch(`/weather?city=${city}`);
    let weatherData = await weatherRes.json();
    
    function windDirection(degree) {
      if (degree>337.5) return 'N';
      if (degree>292.5) return 'NW';
      if(degree>247.5) return 'W';
      if(degree>202.5) return 'SW';
      if(degree>157.5) return 'S';
      if(degree>122.5) return 'SE';
      if(degree>67.5) return 'E';
      if(degree>22.5) return 'NE';
      return 'N';
    }

    document.getElementById('weather').innerHTML = `
      <div class="weather-info">
        <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png" 
             alt="${weatherData.weather[0].description}" />
        <div>
          <h2>${weatherData.name}, ${weatherData.sys.country}</h2>
          <div class="column-container">
            <div class="column">
              <p><strong>Current Temperature:</strong> ${weatherData.main.temp}°C</p>
              <p><strong>Weather:</strong> ${weatherData.weather[0].main} (${weatherData.weather[0].description})</p>
              <p><strong>Feels Like:</strong> ${weatherData.main.feels_like}°C</p>
              <p><strong>Humidity:</strong> ${weatherData.main.humidity}%</p>
              <p><strong>Pressure:</strong> ${weatherData.main.pressure} hPa</p>
            </div>
            <div class="column">
              <p><strong>Wind:</strong> ${weatherData.wind.speed} m/s ${windDirection(weatherData.wind.deg)}</p>
              <p><strong>Coordinates:</strong> [${weatherData.coord.lat}, ${weatherData.coord.lon}]</p>
              <p><strong>Rain (3h):</strong> ${weatherData.rain ? weatherData.rain['3h'] || '0' : '0'} mm</p>
              <p><strong>Cloud Cover:</strong> ${weatherData.clouds.all}%</p>
              <p><strong>Visibility:</strong> ${weatherData.visibility} meters</p>
            </div>
          </div>
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
    console.error('Error:', error);
  }
}

document.getElementById('getWeatherBtn').addEventListener('click', weather);
document.getElementById('cityInput').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    weather();
  } 
});