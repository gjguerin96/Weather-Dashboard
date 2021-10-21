var weatherData = 'https://api.openweathermap.org/data/2.5/onecall?lat=32.7&lon=-117.2&exclude=minutely&appid=43abac14890ebe341638d2d5fc067d02'
var test = document.getElementById('test')

function getApi() {
    fetch (weatherData)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data)
        for (var i = 0; i < 5; i++) {
            var weather = document.createElement("p")
            weather.textContent = data[i].lat;
            test.append(weather)
        }
    })  
}
getApi()