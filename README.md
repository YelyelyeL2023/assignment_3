# Weather, Movies & Quotes Application

A full-stack web application that provides weather information, movie search, and Breaking Bad quotes functionality.

## Features

- **Weather Dashboard**: Real-time weather data and forecasts using OpenWeather API
- **Movie Search**: Search and browse movies with images and details
- **Breaking Bad Quotes**: Random quotes from Breaking Bad series
- **Interactive Map**: Visual display of weather locations using Leaflet

## Setup Instructions

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

## API Endpoints

### Weather
- `GET /weather?city={cityName}`
  - Returns current weather data for specified city
  - Uses OpenWeather API

### Forecast
- `GET /forecast?city={cityName}`
  - Returns 5-day weather forecast
  - Uses OpenWeather API

### Movies
- `GET /movies?title={movieTitle}`
  - Searches movies by title
  - Uses MovieDatabase API

### Quotes
- `GET /movie-quotes`
  - Returns random Breaking Bad quotes
  - Uses Breaking Bad Quotes API

## Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- APIs: OpenWeather, MovieDatabase, Breaking Bad Quotes
- Map: Leaflet.js

## Project Structure

- public - Static frontend files
- server.js - Express server and API routes
- package.json - Project dependencies and scripts

## Authors

- Yelarys
- Farida
- Bekzhan