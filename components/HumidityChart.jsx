import './Chart.css';

export default function HumidityChart({ weatherData }) {
  if (!weatherData || weatherData.length === 0) return null;

  // Sort by humidity for better visualization
  const sortedData = [...weatherData].sort((a, b) => b.rh - a.rh);
  const maxHumidity = 100; // Humidity is always 0-100%

  return (
    <div className="chart-container">
      <h3>💧 Humidity Levels</h3>
      <p className="chart-subtitle">Relative humidity comparison</p>
      
      <div className="bar-chart">
        {sortedData.map((item, index) => (
          <div key={index} className="bar-wrapper">
            <div 
              className="bar"
              style={{ 
                height: `${(item.rh / maxHumidity) * 100}%`,
                background: `linear-gradient(180deg, 
                  ${item.rh >= 70 ? '#06b6d4' : item.rh >= 40 ? '#0ea5e9' : '#38bdf8'} 0%, 
                  ${item.rh >= 70 ? '#0891b2' : item.rh >= 40 ? '#0284c7' : '#0ea5e9'} 100%)`
              }}
            >
              <span className="bar-value">{item.rh}%</span>
            </div>
            <span className="bar-label">{item.city_name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}