import React from "react";
import { useState, useEffect } from "react";
import "../index.css";
import axios from "axios";
import WeatherDetails from "./WeatherDetails";
import img from '../assets/ubg1.jpg'
import SelectComponent from "./SelectComponent";
import Button from "../util/Button";
import { useSafeMantineTheme } from "@mantine/core";
import Loader from "./Loader";


export default function Home() {
  const [weather, setWeather] = useState(null)
  const [loading,setLoading]  = useState(false);
  const apiKey = "";  //api removed for security reasons(find api key info from readme.md )
  const [units, setUnits] = useState("metric");
  const [inputType, setInputType] = useState("city");

  const handleInputTypeChange = (e) => {
    setInputType(e.target.value);
  };

  const renderTemperature = (value) => {
    if (units === "metric") {
      return `${value}\u00b0C`;
    }
    if (units === "imperial") {
      return `${value}\u00b0F`;
    }
    return `${value}\u212A`;
  };

   // Function to fetch weather data
  const fetchWeatherData = async (loc, lat, lon, units) => {
    setLoading(true);
    let url;
    if (loc) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${loc}&appid=${apiKey}&units=${units}`;
    } else if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
    }

    try {
      const res = await axios.get(url);
      return {
        descp: res.data.weather[0].description,
        temp: res.data.main.temp,
        city: res.data.name,
        humidity: res.data.main.humidity,
        wind: res.data.wind.speed,
        feel: res.data.main.feels_like,
      };
      setLoading(false);
    } catch (error) {
      console.error("Error occurred while fetching API data.");
      setLoading(false);
      throw error;
    }
  };

  // Runs when the user submits the form with the location data
  const apiCall = async (e) => {
    e.preventDefault();
    let loc = "";
    let lat = "";
    let lon = "";

    if (inputType === "city") {
      loc = e.target.elements.loc.value;
    } else if (inputType === "coordinates") {
      lat = e.target.elements.lat.value;
      lon = e.target.elements.lon.value;
    }

    try {
      const newWeatherData = await fetchWeatherData(loc, lat, lon, units);
      setWeather(newWeatherData);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        //Error handeling done using try and catch block .
        alert("Please enter valid city name or coordinates.");
      } else {
        console.error("Error occurred while fetching API data.");
      }
    }
  };

  // Function to update weather data when the unit changes
  const updateWeatherData = async (selectedUnit = units) => {
    if (weather && weather.city) {
      try {
        const newWeatherData = await fetchWeatherData(
          weather.city,
          null,
          null,
          selectedUnit
        );
        setWeather(newWeatherData);
        setUnits(selectedUnit);
      } catch (error) {
        // Handle error if needed
      }
    }
  };

  // Add useEffect to update weather data when the unit changes
  useEffect(() => {
    updateWeatherData();
  }, [units]);

  // Function to handle unit button click and update units state
  const handleUnitChange = (selectedUnit) => {
    updateWeatherData(selectedUnit);
  };
  
  return (
    <>
   <div className="app">
      <div className="search">
        <form onSubmit={apiCall}>
          <div className="flex justify-center">
            <SelectComponent inputType = {inputType} handleInputTypeChange = {handleInputTypeChange} />
          </div>

          {inputType === "city" ? (
            <input type="text" placeholder="Enter your city" name="loc" />
          ) : (
            <div className="flex 
             flex-col justify-center space-y-7
            md:flex-row md:space-x-5 md:space-y-0">
              <input type="text" placeholder="Enter latitude" name="lat" />
              <input type="text" placeholder="Enter longitude" name="lon" />
            </div>
          )}

          <Button text={"Get Weather"} />
        </form>
        {weather && (
          <WeatherDetails
            units={units}
            handleUnitChange={handleUnitChange}
            weather={weather}
            renderTemperature={renderTemperature}
          />
        )}
     { loading && <Loader />}
      </div>
    </div>
      </>
  );
}