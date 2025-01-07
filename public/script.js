let map;
weather();

async function weather() {
  const city = document.getElementById('cityInput').value || 'London';
  try {
    let weatherRes = await fetch(`/weather?city=${city}`);
    let weatherData = await weatherRes.json();
    function windDirection(degree){
      if (degree>337.5) return 'N';
      if (degree>292.5) return 'NW';
      if (degree>247.5) return 'W';
      if (degree>202.5) return 'SW';
      if (degree>157.5) return 'S';
      if (degree>122.5) return 'SE';
      if (degree>67.5) return 'E';
      if (degree>22.5) return 'NE';
      return 'Northerly';
  }
    document.getElementById('weather').innerHTML = `
      <div class="weather-info">
        <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png" alt="Weather Icon" />
        <div>
          <h2>${weatherData.name}, ${weatherData.sys.country}</h2>
          <div class="column-container">
            <div class="column">
              <p>Weather: ${weatherData.weather[0].main} (${weatherData.weather[0].description})</p>
              <p>Temperature: ${weatherData.main.temp}°C</p>
              <p>Feels like: ${weatherData.main.feels_like}°C</p>
              <p>Min/Max: ${weatherData.main.temp_min}°C / ${weatherData.main.temp_max}°C</p>
              <p>Humidity: ${weatherData.main.humidity}%</p>
              <p>Coordinates: [${weatherData.coord.lat}, ${weatherData.coord.lon}]</p>
            </div>
            <div class="column">
              <p>Pressure: ${weatherData.main.pressure} hPa</p>
              <p>Clouds: ${weatherData.clouds.all}%</p>
              <p>Wind: ${weatherData.wind.speed} m/s ${windDirection(weatherData.wind.deg)}</p>
              <p>Rain (3h): ${weatherData.rain ? weatherData.rain['3h'] || '0' : '0'} mm</p>
              <p>Sunrise: ${new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}</p>
              <p>Sunset: ${new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}</p>
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
    console.error(error);
  }
}

document.getElementById('getWeatherBtn').addEventListener('click', weather);
document.getElementById('cityInput').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    weather();
  } 
});