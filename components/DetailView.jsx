import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './DetailView.css';

export default function DetailView() {
  const { cityName } = useParams();
  const API_KEY = import.meta.env.VITE_APP_API_KEY;
  
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCityWeather = async () => {
      try {
        setLoading(true);
        setError("");

        const cityParam = encodeURIComponent(cityName);
        const weatherUrl = `https://api.weatherbit.io/v2.0/current?city=${cityParam}&country=US&units=I&key=${API_KEY}`;

        const response = await fetch(weatherUrl);
        const json = await response.json();

        if (json.error || !json.data || json.data.length === 0) {
          throw new Error("City not found");
        }

        setWeatherData(json.data[0]);
        setLoading(false);
      } catch (e) {
        console.error("❌ Fetch error:", e);
        setError(e.message || "Failed to fetch data");
        setLoading(false);
      }
    };

    fetchCityWeather();
  }, [cityName]);

  if (loading) {
    return (
      <div className="detail-view">
        <nav className="navBar">
          <Link to="/">Dashboard</Link>
          <Link to="/">Search</Link>
          <Link to="/">About</Link>
        </nav>
        <div className="detail-content">
          <p className="loading-message">Loading weather details...</p>
        </div>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="detail-view">
        <nav className="navBar">
          <Link to="/">Dashboard</Link>
          <Link to="/">Search</Link>
          <Link to="/">About</Link>
        </nav>
        <div className="detail-content">
          <p className="error-message">{error || "City not found"}</p>
          <Link to="/" className="back-button">← Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-view">
      <h1>🌙 AstroDash</h1>

      <nav className="navBar">
        <Link to="/">Dashboard</Link>
        <Link to="/">Search</Link>
        <Link to="/">About</Link>
      </nav>

      <div className="detail-content">
        <Link to="/" className="back-button">← Back to Dashboard</Link>
        
        <div className="detail-header">
          <h2>{weatherData.city_name}, {weatherData.state_code}</h2>
          <p className="country">{weatherData.country_code}</p>
        </div>

        <div className="detail-main">
          <div className="main-temp">
            <h3>{weatherData.temp}°F</h3>
            <p>{weatherData.weather?.description || 'N/A'}</p>
          </div>
          <div className="weather-icon">
            <span style={{ fontSize: '4rem' }}>
              {weatherData.weather?.icon ? `☀️` : '🌤️'}
            </span>
          </div>
        </div>

        <div className="detail-grid">
          <div className="detail-card">
            <h4>🌡️ Feels Like</h4>
            <p className="value">{weatherData.app_temp}°F</p>
          </div>

          <div className="detail-card">
            <h4>💧 Humidity</h4>
            <p className="value">{weatherData.rh}%</p>
          </div>

          <div className="detail-card">
            <h4>💨 Wind Speed</h4>
            <p className="value">{weatherData.wind_spd?.toFixed(1)} mph</p>
          </div>

          <div className="detail-card">
            <h4>🧭 Wind Direction</h4>
            <p className="value">{weatherData.wind_cdir || 'N/A'}</p>
          </div>

          <div className="detail-card">
            <h4>☁️ Cloud Coverage</h4>
            <p className="value">{weatherData.clouds}%</p>
          </div>

          <div className="detail-card">
            <h4>👁️ Visibility</h4>
            <p className="value">{weatherData.vis} miles</p>
          </div>

          <div className="detail-card">
            <h4>🌡️ Pressure</h4>
            <p className="value">{weatherData.pres} mb</p>
          </div>

          <div className="detail-card">
            <h4>☀️ UV Index</h4>
            <p className="value">{weatherData.uv?.toFixed(1) || 'N/A'}</p>
          </div>

          <div className="detail-card">
            <h4>🌧️ Precipitation</h4>
            <p className="value">{weatherData.precip || 0} in/hr</p>
          </div>

          <div className="detail-card">
            <h4>🌅 Sunrise</h4>
            <p className="value">{weatherData.sunrise || 'N/A'}</p>
          </div>

          <div className="detail-card">
            <h4>🌇 Sunset</h4>
            <p className="value">{weatherData.sunset || 'N/A'}</p>
          </div>

          <div className="detail-card">
            <h4>📍 Coordinates</h4>
            <p className="value">{weatherData.lat?.toFixed(2)}, {weatherData.lon?.toFixed(2)}</p>
          </div>
        </div>

        <div className="observation-time">
          <p>Last updated: {new Date(weatherData.ob_time).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}