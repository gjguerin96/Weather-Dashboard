// var weatherData = 'https://api.openweathermap.org/data/2.5/onecall?lat=32.7&lon=-117.2&exclude=minutely&appid=43abac14890ebe341638d2d5fc067d02'
var userInput = document.querySelector("input[name=city");
var searchBtn = document.querySelector("#searchbtn");
var pastSearches = document.querySelector("#previous-cities");
var contentEl = document.querySelector("#main-card");
var futureWeather = document.querySelector("#forecast");
var form = document.querySelector("form");
var pastButtons = [];
var apiKey = "43abac14890ebe341638d2d5fc067d02"

function searchAndGenerateWeather(city) {
    //clear the html for new content
    contentEl.innerHTML = "";
    futureWeather.innerHTML = "";
  
    var geoLocateCityURL =
      "https://api.openweathermap.org/geo/1.0/direct?q=" +
      city +
      ",US&limit=5&appid=" +
      apiKey;
  
    fetch(geoLocateCityURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var cityInfo = data[0];
        var getWeatherUrl =
          "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          cityInfo.lat +
          "&lon=" +
          cityInfo.lon +
          "&exclude=minutely,hourly&units=imperial&appid=" +
          apiKey;
  
        fetch(getWeatherUrl)
          .then(function (response) {
            return response.json();
          })
          .then(function (weatherData) {
            var cityNameEl = document.createElement("h2");
            cityNameEl.textContent = city.toUpperCase() + " "+  moment.unix(weatherData.current.sunrise).format("DD/MM/YYYY");
            var mainWeatherIcon = document.createElement("img");
            mainWeatherIcon.setAttribute(
              "src",
              "https://openweathermap.org/img/w/" +
                weatherData.current.weather[0].icon +
                ".png"
            );
            cityNameEl.append(mainWeatherIcon);
  
            contentEl.append(cityNameEl);
  
            var cityWeatherList = document.createElement("ul");
  
            var temp = document.createElement("li");
            temp.textContent = "Temp: " + weatherData.current.temp + " F";
            cityWeatherList.append(temp);
  
            var wind = document.createElement("li");
            wind.textContent =
              "Wind speed: " + weatherData.current.wind_speed + " mph";
            cityWeatherList.append(wind);
  
            var humidity = document.createElement("li");
            humidity.textContent =
              "Humidty: " + weatherData.current.humidity + "%";
            cityWeatherList.append(humidity);
  
            var uvi = document.createElement("li");
            uvi.textContent = "UV index: " + weatherData.current.uvi;
            cityWeatherList.append(uvi);
            if (weatherData.current.uvi > 2) {
                uvi.setAttribute("style", "background-color: red")
                }
                else if (weatherData.current.uvi < 1) {
                    uvi.setAttribute("style", "background-color: green")
                    }
                else {
                    uvi.setAttribute("style", "background-color: yellow")
                }

  
            contentEl.append(cityWeatherList);
  
            //--------------------------
            // Forcast Section --------
            var forecastTitle = document.createElement("h2");
            forecastTitle.textContent = "5-day Forecast";
            futureWeather.append(forecastTitle);
  
            for (var i = 0; i < 5; i++) {
              var dayXweather = weatherData.daily[i];
              var dayXweatherCard = document.createElement("ul");
              dayXweatherCard.setAttribute("style", "width: 20%")
  
              var date = moment.unix(dayXweather.sunrise).format("DD/MM/YYYY");
  
              dayXweatherCard.append(date);
              var weatherIcon = document.createElement("img");
              weatherIcon.setAttribute(
                "src",
                "https://openweathermap.org/img/w/" +
                  dayXweather.weather[0].icon +
                  ".png"
              );
              dayXweatherCard.append(weatherIcon);
  
              var temp = document.createElement("li");
              temp.textContent = "Temp: " + dayXweather.temp.day + " F";
              dayXweatherCard.append(temp);
  
              var wind = document.createElement("li");
              wind.textContent = "Wind speed: " + dayXweather.wind_speed + " mph";
              dayXweatherCard.append(wind);
  
              var humidity = document.createElement("li");
              humidity.textContent = "Humidty: " + dayXweather.humidity + "%";
              dayXweatherCard.append(humidity);
  
              futureWeather.append(dayXweatherCard);
            }
          });
      });
  }
  searchBtn.addEventListener("click", function (e) {
    e.preventDefault();
    var searchValue = userInput.value.trim();
  
    if (!searchValue) {
      return;
    }
  
    pastButtons.push(searchValue)
    searchAndGenerateWeather(searchValue);
    makeButtons()
  });
  
  function intialLoad() {
    var previousCitiesButtons = localStorage.getItem("previousCities");
    if (previousCitiesButtons) {
      pastButtons = JSON.parse(previousCitiesButtons);
      makeButtons();
    }
  }
  
  function makeButtons() {
    pastSearches.innerHTML = ""
    for (var i = 0; i < pastButtons.length; i++) {
      const city = pastButtons[i];
      var newBtn = document.createElement("button");
  
      newBtn.textContent = city;
      newBtn.setAttribute("data-value", city);
  
      newBtn.addEventListener("click", function () {
        var searchCity = this.getAttribute("data-value");
        searchAndGenerateWeather(searchCity);
      });
      pastSearches.append(newBtn);
    }
  
    console.log(pastButtons)
    localStorage.setItem("previousCities", JSON.stringify(pastButtons));
  }
  
  intialLoad()
  