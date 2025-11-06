import './Chart.css';

export default function TempChart({ weatherData }) {
  if (!weatherData || weatherData.length === 0) return null;

  // Sort by temperature for better visualization
  const sortedData = [...weatherData].sort((a, b) => b.temp - a.temp);
  const maxTemp = Math.max(...weatherData.map(item => item.temp));

  return (
    <div className="chart-container">
      <h3>🌡️ Temperature Comparison</h3>
      <p className="chart-subtitle">Temperature across all cities</p>
      
      <div className="bar-chart">
        {sortedData.map((item, index) => (
          <div key={index} className="bar-wrapper">
            <div 
              className="bar"
              style={{ 
                height: `${(item.temp / maxTemp) * 100}%`,
                background: `linear-gradient(180deg, 
                  ${item.temp >= 80 ? '#ef4444' : item.temp >= 60 ? '#f59e0b' : '#3b82f6'} 0%, 
                  ${item.temp >= 80 ? '#dc2626' : item.temp >= 60 ? '#d97706' : '#2563eb'} 100%)`
              }}
            >
              <span className="bar-value">{item.temp}°</span>
            </div>
            <span className="bar-label">{item.city_name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}