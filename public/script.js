document.getElementById('getWeatherBtn').addEventListener('click', async () => {
    const city = document.getElementById('cityInput').value || 'London';
    try {
      // Fetch weather
      const weatherRes = await fetch(`/weather?city=${city}`);
      const weatherData = await weatherRes.json();
      document.getElementById('weather').innerText =
        JSON.stringify(weatherData, null, 2);
  
      // Initialize map
      const { coord } = weatherData;
      if (coord) {
        const map = L.map('map').setView([coord.lat, coord.lon], 6);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19
        }).addTo(map);
        L.marker([coord.lat, coord.lon]).addTo(map);
  
        // Extra 1 (Moon Phase)
        const extra1Res = await fetch(`/extra1?city=${city}`);
        const extra1Data = await extra1Res.json();
        document.getElementById('moon').innerText =
          'Moon Phase: ' + JSON.stringify(extra1Data, null, 2);
      }
  
      // Extra 2
      const extra2Res = await fetch('/extra2');
      const extra2Data = await extra2Res.json();
      document.getElementById('extra2').innerText =
        'Cat Fact: ' + JSON.stringify(extra2Data, null, 2);
  
    } catch (error) {
      console.error(error);
    }
  });