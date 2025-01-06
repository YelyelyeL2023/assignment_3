async function weather(){
  const city = document.getElementById('cityInput').value || 'London';
    try {
      // Fetch weather
      const weatherRes = await fetch(`/weather?city=${city}`);
      const weatherData = await weatherRes.json();
      document.getElementById('weather').innerText =
        JSON.stringify(weatherData, null, 2);

      // Initialize map
      let { coord } = weatherData;
      const map = L.map('map').setView([coord.lat, coord.lon], 6);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);
      L.marker([coord.lat, coord.lon]).addTo(map);
    } catch (error) {
      console.error(error);
    }
}

document.getElementById('getWeatherBtn').addEventListener('click', weather());
document.getElementById('cityInput').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    weather();
  }
});