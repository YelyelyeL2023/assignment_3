# Multi-Feature Web Application

A web application that combines weather information, movie search, and Breaking Bad quotes functionality.

## Features

### Weather Dashboard
- Real-time weather data display using OpenWeather API
- Interactive map integration with Leaflet.js
- Detailed weather metrics including:
  - Temperature and "feels like"
  - Weather conditions with icons
  - Wind speed and direction
  - Humidity and pressure
  - Visibility and cloud cover
  - Rain data (when available)

### Movie Database
- Search movies using RapidAPI Movies Database
- Display movie information including:
  - Movie title and poster
  - Release year
  - Type classification
- Responsive grid layout for search results

### Breaking Bad Quotes
- Random quote generation
- Author attribution
- One-click quote refresh

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Start the server:
```bash
npm start
```
4. Access the application at `http://localhost:3000`

## API Keys

The application uses the following API keys:
- OpenWeather API: `35969e08ae6c042dca65746208702818`
- RapidAPI Movies Database: `ef6ec19b59mshe456a56f96330aap170096jsnfd75d5a51584`

## Project Structure

```
/
├── public/
│   ├── index.html      # Weather dashboard
│   ├── movies.html     # Movie search page
│   ├── movie-quotes.html # Quotes page
│   ├── script.js       # Weather functionality
│   ├── movies.js       # Movie search functionality
│   ├── movie-quotes.js # Quotes functionality
│   └── style.css       # Shared styles
├── server.js           # Express server & API routes
└── package.json
```

## Technologies Used

- Frontend:
  - HTML5
  - CSS3
  - JavaScript
  - Leaflet.js for maps
- Backend:
  - Node.js
  - Express
- APIs:
  - OpenWeather API
  - RapidAPI Movies Database
  - Breaking Bad Quotes API

## Contributors

- Yelarys
- Farida
- Bekzhan
- Group: IT-2306

## License

ISC License