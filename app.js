const notification = document.querySelector(".notification");
const icon = document.querySelector(".weather-icon");
const tempValue = document.querySelector(".temperature-value p");
const tempDescription = document.querySelector(".temperature-description p");
const tempLocation = document.querySelector(".location p");
const openWeatherKey = "dafebd460700a5e7c6020854fc65f8c2";
const KELVIN = 273;

const weather = {};

weather.temperature = {
  unit: "celsius",
};


const setPosition = (position) => {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getWeather(latitude, longitude);
};

const showError = (error) => {
    notification.style.display = "block";
    notification.innerHTML = `<p> ${error.message} </p>`;
};

// Geolocation
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
  notification.style.display = "block";
  notification.innerHTML = "<p> Browser Doesn't Support Geolocation. </p>";
}

const celsiusToFahrenheit = (temperature) => {
  return (temperature * 9) / 5 + 32;
};

tempValue.addEventListener("click", () => {
  if (weather.temperature.value === "undefined") return;
  if (weather.temperature.unit === "celsius") {
    let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
    fahrenheit = Math.floor(fahrenheit);
    tempValue.innerHTML = `${fahrenheit}° <span> F </span`;
    weather.temperature.unit = "fahrenheit";
  } else {
    tempValue.innerHTML = `${weather.temperature.value}° <span>C</span`;
    weather.temperature.unit = "celsius";
  }
});

const displayWeather = () => {
  icon.innerHTML = `<img src="icons/${weather.iconId}.png" />`;
  tempValue.innerHTML = `${weather.temperature.value}° <span> C </span>`;
  tempDescription.innerHTML = weather.description;
  tempLocation.innerHTML = `${weather.city}, ${weather.country}`;
};

const getWeather = (latitude, longitude) => {
  let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${openWeatherKey}`;

  fetch(api)
    .then((response) => {
      let data = response.json();
      return data;
    })
    .then((data) => {
      weather.temperature.value = Math.floor(data.main.temp - KELVIN);
      weather.description = data.weather[0].description;
      weather.iconId = data.weather[0].icon;
      weather.city = data.name;
      weather.country = data.sys.country;
    })
    .then(() => {
      displayWeather();
    });
};