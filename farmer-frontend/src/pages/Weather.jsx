import { useState } from 'react';
import { weatherAPI } from '../services/api';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!city) return;

    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const response = await weatherAPI.getWeather(city);
      setWeather(response.data);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch weather data';
      const hint = err.response?.data?.hint;
      setError(hint ? `${errorMsg}\n${hint}` : errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (description) => {
    const desc = description.toLowerCase();
    if (desc.includes('clear')) return '☀️';
    if (desc.includes('cloud')) return '☁️';
    if (desc.includes('rain')) return '🌧️';
    if (desc.includes('thunder')) return '⛈️';
    if (desc.includes('snow')) return '❄️';
    if (desc.includes('mist') || desc.includes('fog')) return '🌫️';
    return '🌤️';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Weather Forecast ☁️</h1>
          <p className="text-gray-600 mt-2">Check weather conditions for your location</p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Search Form */}
          <div className="card mb-8">
            <form onSubmit={handleSubmit} className="flex gap-4">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name..."
                className="input-field flex-1"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Loading...' : 'Get Weather'}
              </button>
            </form>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              <div className="whitespace-pre-line">{error}</div>
            </div>
          )}

          {/* Weather Display */}
          {weather && (
            <div className="card">
              {weather.mock && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg mb-6 text-sm">
                  ⚠️ {weather.message}
                </div>
              )}

              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{weather.city}</h2>
                <span className="text-8xl">{getWeatherIcon(weather.description)}</span>
                <p className="text-xl text-gray-600 mt-4 capitalize">{weather.description}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {/* Temperature */}
                <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-6 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-2">Temperature</p>
                  <p className="text-3xl font-bold text-gray-900">{weather.temperature}°C</p>
                </div>

                {/* Humidity */}
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-2">Humidity</p>
                  <p className="text-3xl font-bold text-gray-900">{weather.humidity}%</p>
                </div>

                {/* Wind Speed */}
                <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-2">Wind Speed</p>
                  <p className="text-3xl font-bold text-gray-900">{weather.windSpeed} m/s</p>
                </div>

                {/* Pressure */}
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-lg text-center md:col-span-3">
                  <p className="text-sm text-gray-600 mb-2">Pressure</p>
                  <p className="text-3xl font-bold text-gray-900">{weather.pressure} hPa</p>
                </div>
              </div>

              {/* Farming Recommendations */}
              <div className="mt-8 bg-primary-50 border-l-4 border-primary-600 p-6 rounded">
                <h3 className="font-bold text-lg mb-3 text-gray-900">
                  🌾 Farming Recommendations
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  {weather.temperature > 30 && (
                    <p>• High temperature - ensure adequate irrigation for crops</p>
                  )}
                  {weather.temperature < 15 && (
                    <p>• Low temperature - protect sensitive crops from cold</p>
                  )}
                  {weather.humidity > 70 && (
                    <p>• High humidity - watch for fungal diseases</p>
                  )}
                  {weather.humidity < 40 && (
                    <p>• Low humidity - increase watering frequency</p>
                  )}
                  {weather.windSpeed > 10 && (
                    <p>• High wind speed - secure lightweight materials and protect young plants</p>
                  )}
                  {weather.description.toLowerCase().includes('rain') && (
                    <p>• Rain expected - postpone pesticide/fertilizer application</p>
                  )}
                  {weather.description.toLowerCase().includes('clear') && (
                    <p>• Clear weather - good time for spraying and field work</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Popular Cities Quick Access */}
          {!weather && !loading && (
            <div className="card">
              <h3 className="font-bold text-lg mb-4">Quick Access - Popular Cities</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur'].map((cityName) => (
                  <button
                    key={cityName}
                    onClick={() => {
                      setCity(cityName);
                      setTimeout(() => {
                        const form = document.querySelector('form');
                        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                      }, 100);
                    }}
                    className="px-4 py-2 bg-gray-100 hover:bg-primary-100 rounded-lg text-sm font-semibold text-gray-700 transition"
                  >
                    {cityName}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Weather;
