import './List.css';

export default function List({ weatherData, searchQuery }) {
  if (!weatherData || weatherData.length === 0) {
    return (
      <div className="list">
        <h3>Weather Dashboard</h3>
        <p className="no-results">
          {searchQuery ? `No cities found matching "${searchQuery}"` : 'No weather data available'}
        </p>
      </div>
    );
  }

  return (
    <div className="list">
      <h3>Weather Dashboard ({weatherData.length} cities)</h3>
      <div className="table-header">
        <span>City</span>
        <span>Temperature</span>
        <span>Weather</span>
        <span>Humidity</span>
        <span>Wind Speed</span>
      </div>
      <div className="table-body">
        {weatherData.map((item, index) => (
          <div key={index} className="table-row">
            <span className="city-name">
              {item.city_name}, {item.state_code}
            </span>
            <span className="temperature">
              {item.temp}°F
            </span>
            <span className="weather-desc">
              {item.weather?.description || 'N/A'}
            </span>
            <span className="humidity">
              {item.rh}%
            </span>
            <span className="wind-speed">
              {item.wind_spd?.toFixed(1)} mph
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}