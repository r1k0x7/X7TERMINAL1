'use client';

import { useState, useEffect } from 'react';
import { Globe, Droplets, Wind } from 'lucide-react';
import { fetchEarthquakes, fetchWeather } from '@/lib/api';

const CITIES = ['New York', 'London', 'Tokyo', 'Singapore', 'Sydney', 'Dubai'];

export default function WorldMonitorPanel() {
  const [earthquakes, setEarthquakes] = useState([]);
  const [weather, setWeather] = useState([]);
  const [activeView, setActiveView] = useState('earthquakes');

  useEffect(() => {
    const fetchData = async () => {
      const eqData = await fetchEarthquakes('day');
      setEarthquakes(eqData.map((eq) => ({ mag: eq.properties.mag, place: eq.properties.place, time: eq.properties.time, lat: eq.geometry.coordinates[1], lon: eq.geometry.coordinates[0] })));
      const weatherData = await Promise.all(CITIES.map(async (city) => {
        const data = await fetchWeather(city);
        return data ? { city, temp: data.main.temp, condition: data.weather[0].main, humidity: data.main.humidity, wind: data.wind.speed } : null;
      }));
      setWeather(weatherData.filter(Boolean));
    };
    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div className="terminal-panel p-4">
        <h2 className="terminal-title flex items-center gap-2"><Globe className="w-4 h-4" />World Monitor</h2>
        <div className="flex gap-2 mt-3">
          <button onClick={() => setActiveView('earthquakes')} className={`px-3 py-1 text-xs rounded ${activeView === 'earthquakes' ? 'bg-terminal-accent text-black' : 'bg-terminal-border'}`}>Earthquakes</button>
          <button onClick={() => setActiveView('weather')} className={`px-3 py-1 text-xs rounded ${activeView === 'weather' ? 'bg-terminal-accent text-black' : 'bg-terminal-border'}`}>Weather</button>
        </div>
      </div>
      {activeView === 'earthquakes' ? (
        <div className="space-y-3">
          {earthquakes.slice(0, 20).map((eq, i) => (
            <div key={i} className="terminal-panel p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${eq.mag >= 5 ? 'bg-terminal-danger/20 text-terminal-danger' : eq.mag >= 4 ? 'bg-terminal-warning/20 text-terminal-warning' : 'bg-terminal-accent/20 text-terminal-accent'}`}>
                    {eq.mag.toFixed(1)}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{eq.place}</div>
                    <div className="text-xs text-terminal-muted">{new Date(eq.time).toLocaleString()}</div>
                  </div>
                </div>
                <div className="text-xs text-terminal-muted font-mono">{eq.lat.toFixed(2)}°, {eq.lon.toFixed(2)}°</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-3">
          {weather.map((w) => (
            <div key={w.city} className="terminal-panel p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{w.city}</div>
                  <div className="text-sm text-terminal-muted">{w.condition}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-mono font-bold">{w.temp.toFixed(1)}°C</div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-terminal-muted">
                    <span className="flex items-center gap-1"><Droplets className="w-3 h-3" />{w.humidity}%</span>
                    <span className="flex items-center gap-1"><Wind className="w-3 h-3" />{w.wind} m/s</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
