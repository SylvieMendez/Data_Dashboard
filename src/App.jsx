import { useEffect, useState } from 'react';
import Card from '../components/Card';
import List from '../components/List';
import './App.css';

export default function App() {
  const API_KEY = import.meta.env.VITE_APP_API_KEY;

  // List of cities to fetch weather for
  const cityList = [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
    'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose',
    'Austin', 'Jacksonville', 'Miami', 'Seattle', 'Denver'
  ];

  const [weatherData, setWeatherData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tempFilter, setTempFilter] = useState("all"); // all, hot, moderate, cold
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch weather data for all cities
  const fetchAllWeatherData = async () => {
    try {
      setLoading(true);
      setError("");

      const promises = cityList.map(async (city) => {
        const cityParam = encodeURIComponent(city);
        const weatherUrl = `https://api.weatherbit.io/v2.0/current?city=${cityParam}&country=US&units=I&key=${API_KEY}`;

        const response = await fetch(weatherUrl);
        const json = await response.json();

        if (json.error || !json.data || json.data.length === 0) {
          return null;
        }

        return json.data[0];
      });

      const results = await Promise.all(promises);
      const validData = results.filter(item => item !== null);
      
      setWeatherData(validData);
      setFilteredData(validData);
      setLoading(false);
    } catch (e) {
      console.error("❌ Fetch error:", e);
      setError(e.message || "Failed to fetch data. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllWeatherData();
  }, []);

  // Filter data based on search and temperature filter
  useEffect(() => {
    let filtered = weatherData;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.city_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply temperature filter
    if (tempFilter !== "all") {
      filtered = filtered.filter(item => {
        if (tempFilter === "hot") return item.temp >= 80;
        if (tempFilter === "moderate") return item.temp >= 60 && item.temp < 80;
        if (tempFilter === "cold") return item.temp < 60;
        return true;
      });
    }

    setFilteredData(filtered);
  }, [searchQuery, tempFilter, weatherData]);

  // Calculate summary statistics
  const calculateStats = () => {
    if (weatherData.length === 0) return null;

    const temps = weatherData.map(item => item.temp);
    const avgTemp = (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1);
    
    const sortedTemps = [...temps].sort((a, b) => a - b);
    const medianTemp = sortedTemps.length % 2 === 0
      ? ((sortedTemps[sortedTemps.length / 2 - 1] + sortedTemps[sortedTemps.length / 2]) / 2).toFixed(1)
      : sortedTemps[Math.floor(sortedTemps.length / 2)].toFixed(1);

    const maxTemp = Math.max(...temps).toFixed(1);
    const minTemp = Math.min(...temps).toFixed(1);

    const hotCities = weatherData.filter(item => item.temp >= 80).length;
    const coldCities = weatherData.filter(item => item.temp < 60).length;

    return {
      total: weatherData.length,
      avgTemp,
      medianTemp,
      maxTemp,
      minTemp,
      hotCities,
      coldCities
    };
  };

  const stats = calculateStats();

  return (
    <div className="App">
      <h1>🌙 AstroDash</h1>

      <div className="search_bar">
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by city name..."
        />
        <select 
          value={tempFilter} 
          onChange={(e) => setTempFilter(e.target.value)}
          className="temp-filter"
        >
          <option value="all">All Temperatures</option>
          <option value="hot">Hot (≥80°F)</option>
          <option value="moderate">Moderate (60-79°F)</option>
          <option value="cold">Cold (&lt;60°F)</option>
        </select>
        <button onClick={fetchAllWeatherData}>Refresh</button>
      </div>

      {error && <p style={{color:"salmon"}} className="error">{error}</p>}

      <nav className="navBar">
        <a href="#">Dashboard</a>
        <a href="#">Search</a>
        <a href="#">About</a>
      </nav>

      <div className="container">
        {/* Summary Statistics Cards */}
        {stats && !loading && (
          <div className="stats-container">
            <Card 
              title="Total Cities" 
              value={stats.total} 
              subtitle="cities tracked"
            />
            <Card 
              title="Average Temp" 
              value={`${stats.avgTemp}°F`} 
              subtitle="across all cities"
            />
            <Card 
              title="Median Temp" 
              value={`${stats.medianTemp}°F`} 
              subtitle="middle value"
            />
            <Card 
              title="Temperature Range" 
              value={`${stats.minTemp}°F - ${stats.maxTemp}°F`} 
              subtitle="min to max"
            />
            <Card 
              title="Hot Cities" 
              value={stats.hotCities} 
              subtitle="≥80°F"
            />
            <Card 
              title="Cold Cities" 
              value={stats.coldCities} 
              subtitle="<60°F"
            />
          </div>
        )}

        {/* Weather List */}
        <div className="list-wrapper">
          {loading ? (
            <p className="loading-message">Loading weather data...</p>
          ) : (
            <List weatherData={filteredData} searchQuery={searchQuery} />
          )}
        </div>
      </div>
    </div>
  );
}