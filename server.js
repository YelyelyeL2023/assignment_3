const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const OPENWEATHER_API_KEY = '35969e08ae6c042dca65746208702818'; 
var lat, lon;

// 1. Weather Route
app.get('/weather', async (req, res) => {
  try {
    const city = req.query.city || 'London';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    const response = await axios.get(url);
    lat = response.data.coord.lat;
    lon = response.data.coord.lon;
    res.json(response.data);
    console.log(`${lat} ${lon}`);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// 2. Extra Route 1 (Moon Phase)
app.get('/extra1', async (req, res) => {
  try {
    if (!lat || !lon) {
      return res.status(400).send('Missing latitude or longitude');
    }
    
    const astronomyUrl = `https://api.open-meteo.com/v1/astronomy?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
    const astronomyResponse = await axios.get(astronomyUrl);
    res.json(astronomyResponse.data);
    console.log(astronomyResponse);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// 3. Extra Route 2 (Cat Fact)
app.get('/extra2', async (req, res) => {
  try {
    const response = await axios.get('https://catfact.ninja/fact');
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000 http://localhost:3000');
});