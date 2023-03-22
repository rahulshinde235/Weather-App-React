import React from "react";
import tempLogo from "../assets/temp.svg"
import humLogo from "../assets/humidity.svg"
import locLogo from "../assets/location.svg";


const WeatherDetails = ({ cityData }) => {
  return (
    <div>
      <div className="weather-app-conditions">
        <img
          src={`http://openweathermap.org/img/wn/${cityData.icon}@4x.png`}
          width="150px"
          height="150px"
        />
        <div className="temp">{cityData.temp} ºC</div>
        <p className="clouds">{cityData.clouds}</p>
        <div className="location">
          <img src={locLogo} alt="React Logo" width={24} height={24} />
          <span className="bold-text">
            {cityData.cityName}, {cityData.country}
          </span>
        </div>
      </div>
      <div className="weather-app-details">
        {["feelsLike", "humidity"].map((prop) => (
          <div
            className={
              prop === "feelsLike" ? "details border-right" : "details"
            }
            key={prop}
          >
            <img
              src={prop === "feelsLike" ? tempLogo : humLogo}
              alt="React Logo"
            />
            <div className="weather-app-details-data">
              <p className="bold-text">{cityData[prop]}</p>
              <p>{prop === "feelsLike" ? "Feels like" : "Humidity"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherDetails;
