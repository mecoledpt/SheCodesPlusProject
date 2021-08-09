//Part 1: display current time and date

function formatDate(currentDate) {
  currentDate = new Date();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${days[currentDate.getDay()]}, ${
    months[currentDate.getMonth()]
  } ${currentDate.getDate()}, ${currentDate.getFullYear()}`;
}
function formatTime(currentTime) {
  currentTime = new Date();
  let currentMinutes = currentTime.getMinutes();
  if (currentMinutes < 10) {
    currentMinutes = "0" + currentMinutes;
  }
  if (currentTime.getHours() > 12) {
    return `Last updated at ${
      currentTime.getHours() - 12
    }:${currentMinutes} PM`;
  } else {
    return `Last updated at ${currentTime.getHours()}:${currentMinutes} AM`;
  }
}
function updateDay(dayElement, index) {
  let daysAbbrev = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let currDay = new Date();
  dayIndex = currDay.getDay();
  dayIndex = dayIndex + 1;
  dayElement.innerHTML = `${daysAbbrev[dayIndex + index]}`;
}
let upcomingDays = document.querySelectorAll(".date");
upcomingDays.forEach(updateDay);

let todayDate = document.querySelector("#current-date");
todayDate.innerHTML = formatDate(new Date());

let todayTime = document.querySelector("#current-time");
todayTime.innerHTML = formatTime(new Date());

//Part 2: add search engine, when user searches for a city the city displays on the page
function submitHandler(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-search-input");
  let cityName = document.querySelector("#city-name");
  if (cityName.innerHTML === null) {
    alert("Please enter a city");
  } else {
    cityName = cityInput.value.trim();
    getCityWeather(cityName);
  }
}
function getCityWeather(cityName) {
  let city = cityName.replace(", ", ",").trim();
  let apiKey = "e7404fca7e5b62ae35774a01b0feeac1";
  let units = "imperial";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?";
  let apiUrl = `${apiEndpoint}q=${city}&units=${units}&appid=${apiKey}`;

  axios.get(apiUrl).then(showWeather);
}

function windDirCompass(degrees) {
  let val = Math.floor(degrees / 22.5 + 0.5);
  let dirArr = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  return dirArr[val % 16];
}

function showWeather(response) {
  console.log(response);
  let cityName = document.querySelector("#city-name");
  cityName.innerHTML = `${response.data.name}`;

  let currTemp = document.getElementById("curr-temp");
  currTemp.innerHTML = `${Math.round(response.data.main.temp)}°`;

  let todayHigh = document.getElementById("today-high");
  let todayLow = document.getElementById("today-low");
  todayHigh.innerHTML = `${Math.round(response.data.main.temp_max)}°`;
  todayLow.innerHTML = `${Math.round(response.data.main.temp_min)}°`;

  let currCond = document.getElementById("curr-cond");
  currCond.innerHTML = `${response.data.weather[0].main}`;

  let currHumidity = document.getElementById("curr-humidity");
  currHumidity.innerHTML = `${response.data.main.humidity}%`;

  let currWindDir = document.getElementById("curr-wind-dir");
  currWindDir.innerHTML = `${windDirCompass(response.data.wind.deg)}`;

  let currWindSpeed = document.getElementById("curr-wind-speed");
  currWindSpeed.innerHTML = `${Math.round(response.data.wind.speed)} mph`;

  showWeatherIcon(response);
}

function showWeatherIcon(response) {
  let currentConditionIcon = document.querySelector("#cond-icon");
  let weatherCode = response.data.weather[0].id;
  let iconCode = "";
  if (weatherCode >= 200 && weatherCode <= 232) {
    iconCode = "11d";
  } else if (weatherCode >= 300 && weatherCode <= 321) {
    iconCode = "09d";
  } else if (weatherCode >= 500 && weatherCode <= 531) {
    iconCode = "10d";
  } else if (weatherCode >= 600 && weatherCode <= 622) {
    iconCode = "13d";
  } else if (weatherCode >= 701 && weatherCode <= 781) {
    iconCode = "50d";
  } else if (weatherCode === 801) {
    iconCode = "02d";
  } else if (weatherCode === 802) {
    iconCode = "03d";
  } else if (weatherCode === 803 || weatherCode === 804) {
    iconCode = "04d";
  } else if (weatherCode === 800) {
    iconCode = "01d";
  }
  let iconURL = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  currentConditionIcon.innerHTML = `<img src = "${iconURL}" alt="Weather Icon">`;
}

getCityWeather("New York");
let searchForm = document.querySelector("#city-search");
searchForm.addEventListener("submit", submitHandler);

//Add a button to call the current location and show weather at that location
function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  searchLatLong(latitude, longitude);
}

function searchLatLong(latitude, longitude) {
  let apiKey = "e7404fca7e5b62ae35774a01b0feeac1";
  let units = "imperial";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?";
  let apiUrlLatLong = `${apiEndpoint}lat=${latitude}&lon=${longitude}&units=${units}&appid=${apiKey}`;

  axios.get(apiUrlLatLong).then(showWeather);
}

function getLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}
let locateButton = document.getElementById("locate-btn");
locateButton.addEventListener("click", getLocation);

//Part 3: add links to "convert" celcius to fahrenheit or vice versa (can use fake data)
function tempConvertCelcius(event) {
  event.preventDefault();
  let currTemp = document.getElementById("curr-temp");
  let currTempNum = parseInt(currTemp.textContent, 10);
  let tempCelcius = Math.round((currTempNum - 32) * (5 / 9));
  currTemp.innerHTML = `${tempCelcius}°`;

  let fahrenheitLink = document.querySelector("a#fahrenheit-link");
  fahrenheitLink.classList.remove("inactive");
  fahrenheitLink.addEventListener("click", tempConvertFahrenheit);

  let celciusLink = document.querySelector("a#celcius-link");
  celciusLink.classList.add("inactive");
  celciusLink.removeEventListener("click", tempConvertCelcius);
}

let celciusLink = document.querySelector("a#celcius-link");
celciusLink.addEventListener("click", tempConvertCelcius);

function tempConvertFahrenheit(event) {
  event.preventDefault();
  let currTemp = document.getElementById("curr-temp");
  let currTempNum = parseInt(currTemp.textContent, 10);
  let tempFahrenheit = Math.round((currTempNum * 9) / 5 + 32);
  currTemp.innerHTML = `${tempFahrenheit}°`;

  let fahrenheitLink = document.querySelector("#fahrenheit-link");
  fahrenheitLink.classList.remove("inactive");
  fahrenheitLink.removeEventListener("click", tempConvertFahrenheit);

  let celciusLink = document.querySelector("#celcius-link");
  celciusLink.classList.add("inactive");
  celciusLink.addEventListener("click", tempConvertCelcius);
}
