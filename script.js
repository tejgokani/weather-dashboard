window.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('getWeather');
    const resultDiv = document.getElementById('weatherResult');
  
    // Set current time
    const now = new Date();
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    document.querySelector('.time').textContent = ` ${formattedTime}`;
  
    button.addEventListener('click', async () => {
      const city = document.getElementById('cityInput').value.trim();
      if (!city) {
        resultDiv.innerHTML = '<p>Please enter a city name.</p>';
        return;
      }
  
      resultDiv.innerHTML = 'Fetching weather data...';
  
      try {
        // Step 1: Geocoding
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
        const geoData = await geoRes.json();
  
        if (!geoData.results || geoData.results.length === 0) {
          resultDiv.innerHTML = `<p>No results found for "${city}".</p>`;
          return;
        }
  
        const { latitude, longitude, name, country, timezone } = geoData.results[0];
  
        // Step 2: Weather API
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=uv_index_max,temperature_2m_max,temperature_2m_min,sunrise,sunset,relative_humidity_2m_max&timezone=${timezone}`
        );
        const weatherData = await weatherRes.json();
  
        const current = weatherData.current_weather;
        const daily = weatherData.daily;
  
        const temperature = current.temperature;
        const windspeed = current.windspeed;
        const weatherCode = current.weathercode;
        const uvIndex = daily.uv_index_max[0];
        const humidity = daily.relative_humidity_2m_max[0];
        const sunrise = new Date(daily.sunrise[0]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        const sunset = new Date(daily.sunset[0]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  
        // 🌅 Result Display
        resultDiv.innerHTML = `
          <h2>Weather in ${name}, ${country}</h2>
          <p><strong>Temperature:</strong> ${temperature} °C</p>
          <p><strong>Wind Speed:</strong> ${windspeed} km/h</p>
          <p><strong>Humidity:</strong> ${humidity}%</p>
          <p><strong>UV Index:</strong> ${uvIndex}</p>
          <p><strong>Sunrise:</strong> 🌅 ${sunrise}</p>
          <p><strong>Sunset:</strong> 🌇 ${sunset}</p>
          
        `;
      } catch (err) {
        console.error(err);
        resultDiv.innerHTML = `<p>Failed to fetch weather data. Try again later.</p>`;
      }
    });
  });