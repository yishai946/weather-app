import "./App.css";
import { useEffect, useState } from "react";

export default function App() {
  const [weatherCurrent, setWeatherCurrent] = useState({});
  const [weatherLocation, setWeatherLocation] = useState({});
  const [weatherCondition, setWeatherCondition] = useState({});

  const [cities, setCities] = useState([]);
  const [input, setInput] = useState("");

  const API_KEY = "004c0e7a43d9406a906140109232809";
  const city = "London";
  const wetherApiUrl = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`;
  const citiesUrl =
    "https://raw.githubusercontent.com/lmfmaier/cities-json/master/cities500.json";

  const start = (startCity) => useEffect(() => {
    search("new york");
  }, []);

  async function getCities(input) {
    const citiesApiUrl = `https://data.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000@public/records?select=name&where="${input}"&limit=3`;
    try {
      const response = await fetch(citiesApiUrl);
      const data = await response.json();
      const citiesNames = data.results.map((city) => city.name);
      setCities(citiesNames);
    } catch (error) {
      console.error("Error fetching cities data:", error);
    }
  }

  async function search(city) {
    const wetherApiUrl = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`;

    try {
      const response = await fetch(wetherApiUrl);
      if (!response.ok) {
        throw new Error("Bad Response!");
      }
      const data = await response.json();
      setWeatherCurrent(data.current);
      setWeatherLocation(data.location);
      setWeatherCondition(data.current.condition);
      setInput("");
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  }

  function inputChange(event) {
    const input = event.target.value;
    setInput(input);

    getCities(input);
  }

  function onSearch(event) {
    const city = event.target.name;
    console.log(city);
    search(city);
  }

  return (
    <div className="bigContainer">
      <div className="container">
        <form>
          <label>Enter a city name</label>
          <br />
          <input
            autoComplete="off"
            type="text"
            value={input}
            onChange={inputChange}
            name="input"
          />
        </form>
        {input.length >= 3 && (
          <div className="suggestions">
            {cities.map((cityName, i) => (
              <button key={i} className="searchButton" name={cityName} onClick={onSearch}>
                {cityName}
              </button>
            ))}
          </div>
        )}{" "}
      </div>

      <div className="cardContainer">
        <div className="card">
          <p className="city">{weatherLocation.name}</p>
          <p className="weather">{weatherCondition.text}</p>
          <svg
            xmlSpace="preserve"
            viewBox="0 0 100 100"
            height="100px"
            width="100px"
            y="0px"
            x="0px"
            id="Layer_1"
            version="1.1"
            className="weather"
          >
            {" "}
            <image
              href={weatherCondition.icon}
              y="0"
              x="0"
              height="100"
              width="100"
              id="image0"
            ></image>
          </svg>
          <p className="temp">{weatherCurrent.temp_c}</p>
          <div className="minmaxContainer">
            <div className="min">
              <p className="minHeading">Wind</p>
              <p className="minTemp">{weatherCurrent.wind_kph}</p>
            </div>
            <div className="max">
              <p className="maxHeading">uv</p>
              <p className="maxTemp">{weatherCurrent.uv}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
