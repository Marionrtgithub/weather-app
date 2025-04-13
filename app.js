
const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.use(express.static('public'));
const API_KEY = process.env.OPENWEATHER_API_KEY;
const WEATHER_API_URL = 'http://api.openweathermap.org/data/2.5/weather';
app.get('/', (req, res) => {
  res.render('weatherView', { weather: null, error: null });
});
app.get('/weather', async (req, res) => {
  const city = req.query.city;  

  if (!city) {
    return res.render('weatherView', { weather: null, error: 'Please enter a city name.' });
  }

  try {
    const response = await axios.get(WEATHER_API_URL, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric'
      }
    });

    const weatherData = response.data;
    const weather = {
      city: weatherData.name,
      country: weatherData.sys.country,
      temperature: weatherData.main.temp,
      description: weatherData.weather[0].description,
      icon: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`,
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind.speed,
    };

    res.render('weatherView', { weather: weather, error: null });

  } catch (error) {
    res.render('weatherView', { weather: null, error: 'City not found. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
