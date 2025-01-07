const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const OPENWEATHER_API_KEY = '35969e08ae6c042dca65746208702818'; 

// 1. Weather Route
app.get('/weather', async (req, res) => {
  try {
    const city = req.query.city || 'London';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    const response = await axios.get(url);
    res.json(response.data);
    console.log(response.data);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});


// So we need to add a seperate route with a movie lists
// And another route with movie quotes


// 2. Movies Route
app.get('/movies', async (req, res) => {
  try {
    
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// 3. Movie Quotes route
app.get('/movie-quotes', async (req, res) => {
  try {
    
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.listen(3000, () => {
  console.log(`http://localhost:3000`);
});