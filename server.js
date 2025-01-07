const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const OPENWEATHER_API_KEY = '35969e08ae6c042dca65746208702818'; 
const MOVIES_API_KEY = 'ef6ec19b59mshe456a56f96330aap170096jsnfd75d5a51584'; 

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

// 2. Movies Route
app.get('/movies', async (req, res) => {
  try {
    const title = req.query.title || 'inception';
    const response = await axios.get(`https://moviesdatabase.p.rapidapi.com/titles/search/title/${title}`, {
      headers: {
        'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com',
        'X-RapidAPI-Key': MOVIES_API_KEY
      },
      params: {
        exact: false,
        titleType: 'movie'
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// 3. Movie Quotes route
app.get('/movie-quotes', async (req, res) => {
  try {
      const response = await axios.get('https://quoteapi.pythonanywhere.com/random');
      res.json(response.data);
  } catch (error) {
      res.status(500).send(error.toString());
  }
});

app.listen(3000, () => {
  console.log(`http://localhost:3000`);
});