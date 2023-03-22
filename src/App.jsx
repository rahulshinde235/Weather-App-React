import { useState } from "react";


import "./App.css";
import WeatherDetails from "./components/WeatherDetails";

function App() {
  const [value, setValue] = useState("");
  const [screenIndex, setScreenIndex] = useState(1);
  const [cityData, setCityData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    }
  }

  function showPosition(position) {
    setLoading(true);
    setError(false);
    getConditions(position.coords.latitude, position.coords.longitude);
  }

  function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setError("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        setError("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        setError("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        setError("An unknown error occurred.");
        break;
    }
    setScreenIndex(2)
  }

  const fetchWeather = async (event) => {
    if (event.key === "Enter") {
      setScreenIndex(2)
      setLoading(true);
      setError(false);
      try {
        let res = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=2&appid=${
            import.meta.env.VITE_APP_API_KEY
          }`
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        res = await res.json();
        const { lat, lon } = res[0];
        getConditions(lat, lon);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    }
  };

  const getConditions = async (lat, lon) => {
    setScreenIndex(2);
    try {
      const resData = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&&appid=${
          import.meta.env.VITE_APP_API_KEY
        }`
      );
      if (!resData.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const cityWeatherData = await resData.json();
      setCityData({
        temp: cityWeatherData.main.temp,
        clouds: cityWeatherData.weather[0].description,
        feelsLike: cityWeatherData.main.feels_like,
        humidity: cityWeatherData.main.humidity,
        country: cityWeatherData.sys.country,
        cityName: cityWeatherData.name,
        icon: cityWeatherData.weather[0].icon,
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="weather-app">
      <div className="weather__app__container">
        <div className="weather-app-header">
          {screenIndex === 2 && (
            <div className="go-back-arrow" onClick={() => setScreenIndex(1)}>
              🔙
            </div>
          )}
          <div className="weather__app__header-name">Weather App</div>
        </div>
        {screenIndex === 1 && (
          <div className="weather-app-form">
            <input
              value={value}
              className="weather-app-form-input"
              placeholder="Enter city name"
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={fetchWeather}
            />
            <p>or</p>
            <button
              className="weather-app-form-button"
              onClick={() => {
                setValue("");
                getLocation();
              }}
            >
              Get Device location
            </button>
          </div>
        )}
        {screenIndex === 2 && (
          <div>
            {loading ? (
              <div className="loading">Fetching Data.....</div>
            ) : error ? (
              <div className="error">There was some error fetching your data</div>
            ) : (
              <WeatherDetails cityData={cityData}/>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
