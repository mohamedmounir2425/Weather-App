let today = document.getElementById("today"),
  todayDate = document.getElementById("today-date"),
  cityLocation = document.getElementById("location"),
  todayIcon = document.getElementById("today-icon"),
  description = document.getElementById("today-description"),
  todayDegree = document.getElementById("today-degree"),
  humidty = document.getElementById("humidty"),
  wind = document.getElementById("wind"),
  compass = document.getElementById("compass"),
  searchBar = document.getElementById("search-bar");

//Next Day
let nextDay = document.getElementsByClassName("nextDay"),
  nextDayIcon = document.getElementsByClassName("nextDay-icon"),
  maxDegree = document.getElementsByClassName("max-degree"),
  minDegree = document.getElementsByClassName("min-degree"),
  nextDayDescription = document.getElementsByClassName("nextDay-description"),
  currentCity = "Alex",
  apiResponse,
  responseData,
  monthName = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Spet",
    "Oct",
    "Nov",
    "Dec",
  ],
  days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
let response;
async function getWeatherData(city) {
  response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=3badde505e8448e1b6d23203230605&q=${city}&days=7`
  );
  response = await response.json();
  console.log(response);
  displayTodayWeather();
  displayNextDayWeather();
  getCoordintes();
}

getWeatherData(currentCity);

let date = new Date();

function displayTodayWeather() {
  today.innerHTML = days[date.getDay()];
  todayDate.innerHTML = `${date.getDate()} ${monthName[date.getMonth()]}`;
  cityLocation.innerHTML = response.location.name;
  todayDegree.innerHTML = response.current.temp_c;
  todayIcon.setAttribute("src", `https:${response.current.condition.icon}`);
  description.innerHTML = response.current.condition.text;
  humidty.innerHTML = response.current.humidity;
  wind.innerHTML = response.current.wind_kph;
  compass.innerHTML = response.current.wind_dir;
}

function displayNextDayWeather() {
  for (let i = 0; i < nextDay.length; i++) {
    nextDay[i].innerHTML =
      days[new Date(response.forecast.forecastday[i + 1].date).getDay()];
    nextDayIcon[i].setAttribute(
      "src",
      `https:${response.forecast.forecastday[i + 1].day.condition.icon}`
    );
    maxDegree[i].innerHTML =
      response.forecast.forecastday[i + 1].day.maxtemp_c;
    minDegree[i].innerHTML =
      response.forecast.forecastday[i + 1].day.mintemp_c;
    nextDayDescription[i].innerHTML =
      response.forecast.forecastday[i + 1].day.condition.text;
  }
}
searchBar.addEventListener('keyup', () => {
    currentCity = searchBar.value;
    console.log(currentCity)
    getWeatherData(currentCity)
})


// Step 1: Get user coordinates
function getCoordintes() {
	var options = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0
	};

	function success(pos) {
		var crd = pos.coords;
		var lat = crd.latitude.toString();
		var lng = crd.longitude.toString();
		var coordinates = [lat, lng];
		console.log(`Latitude: ${lat}, Longitude: ${lng}`);
		getCity(coordinates);
		return;

	}

	function error(err) {
		console.warn(`ERROR(${err.code}): ${err.message}`);
	}

	navigator.geolocation.getCurrentPosition(success, error, options);
}

// Step 2: Get city name
function getCity(coordinates) {
	var xhr = new XMLHttpRequest();
	var lat = coordinates[0];
	var lng = coordinates[1];

	// Paste your LocationIQ token below.
	xhr.open('GET', "https://us1.locationiq.com/v1/reverse.php?key=e703a8de6983254e122621be0023c2c0&lat=" +
	lat + "&lon=" + lng + "&format=json", true);
	xhr.send();
	xhr.onreadystatechange = processRequest;
	xhr.addEventListener("readystatechange", processRequest, false);

	function processRequest(e) {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var response = JSON.parse(xhr.responseText);
			var city = response.address.city;
			console.log(city);
			return;
		}
	}
}


