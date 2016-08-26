function getIconName(code) {
  switch(code) {
    case '0': return 'wi wi-tornado';
    case '1': return 'wi wi-storm-showers';
    case '2': return 'wi wi-tornado';
    case '3': return 'wi wi-thunderstorm';
    case '4': return 'wi wi-thunderstorm';
    case '5': return 'wi wi-snow';
    case '6': return 'wi wi-rain-mix';
    case '7': return 'wi wi-rain-mix';
    case '8': return 'wi wi-sprinkle';
    case '9': return 'wi wi-sprinkle';
    case '10': return 'wi wi-hail';
    case '11': return 'wi wi-showers';
    case '12': return 'wi wi-showers';
    case '13': return 'wi wi-snow';
    case '14': return 'wi wi-storm-showers';
    case '15': return 'wi wi-snow';
    case '16': return 'wi wi-snow';
    case '17': return 'wi wi-hail';
    case '18': return 'wi wi-hail';
    case '19': return 'wi wi-cloudy-gusts';
    case '20': return 'wi wi-fog';
    case '21': return 'wi wi-fog';
    case '22': return 'wi wi-fog';
    case '23': return 'wi wi-cloudy-gusts';
    case '24': return 'wi wi-cloudy-windy';
    case '25': return 'wi wi-thermometer';
    case '26': return 'wi wi-cloudy';
    case '27': return 'wi wi-night-cloudy';
    case '28': return 'wi wi-day-cloudy';
    case '29': return 'wi wi-night-cloudy';
    case '30': return 'wi wi-day-cloudy';
    case '31': return 'wi wi-night-clear';
    case '32': return 'wi wi-day-sunny';
    case '33': return 'wi wi-night-clear';
    case '34': return 'wi wi-day-sunny-overcast';
    case '35': return 'wi wi-hail';
    case '36': return 'wi wi-day-sunny';
    case '37': return 'wi wi-thunderstorm';
    case '38': return 'wi wi-thunderstorm';
    case '39': return 'wi wi-thunderstorm';
    case '40': return 'wi wi-storm-showers';
    case '41': return 'wi wi-snow';
    case '42': return 'wi wi-snow';
    case '43': return 'wi wi-snow';
    case '44': return 'wi wi-cloudy';
    case '45': return 'wi wi-lightning';
    case '46': return 'wi wi-snow';
    case '47': return 'wi wi-thunderstorm';
    case '3200': return 'wi wi-cloud';
    default: return 'wi wi-cloud';
  }
}

function getJSON(url, callback) {
  //http://youmightnotneedjquery.com/#json
  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      callback(JSON.parse(request.responseText));
    } else {
      console.error("reached " + url + ", but it returned an error")
      injectErrorMessage();
    }
  };

  request.onerror = function() {
    console.error("connection error in request to " + url)
    injectErrorMessage();
  };

  request.send();
}

function getLocation(callback) {
  var url = "https://freegeoip.net/json/";
  getJSON(url, function(data) {
    if (data.city && data.country_name) {
      callback(data.city + ', ' + data.country_name);
    } else if (data.latitude && data.longitude) {
      console.debug('no placenames found, reverse geocoding...');
      var baseUrl = "https://nominatim.openstreetmap.org/reverse?format=json"
      var revUrl = baseUrl + '&lat=' + data.latitude + '&lon=' + data.longitude;

      getJSON(revUrl, function(data) {
        callback(data.address.state + ', ' + data.address.country);
      });
    } else {
      callback("");
    }
  });
}

function getWeather(callback) {
  getLocation(function(location) {
    if (location) {
      var query = 'select item.condition from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + location + '")';
      var url = "https://query.yahooapis.com/v1/public/yql" + "?q=" + encodeURIComponent(query) + "&format=json";

      getJSON(url, function(data) {
        var condition = data.query.results.channel.item.condition;
        callback(condition, location);
      });
    } else {
      callback({}, "");
    }
  })
}

function injectErrorMessage() {
  var errorMessage = "Sorry, we couldn't load your local weather :("
  document.querySelector('#date').innerHTML = errorMessage;
}

function populatePage() {
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  getWeather(function(condition, location) {
    if (condition && location) {
      var city = document.querySelector('#city');
      city.innerHTML = location.split(',')[0].toUpperCase();

      var currentDate = new Date;
      document.querySelector('#date').innerHTML = months[currentDate.getUTCMonth()].substring(0, 3).toUpperCase() + ' ' + currentDate.getUTCDate();

      var temperature = document.querySelector('#temperature');
      temperature.innerHTML = Math.floor((parseInt(condition.temp) - 32)  * 5 / 9).toString() + "&#176;C";

      var text = document.querySelector('#text');
      text.innerHTML = condition.text.toUpperCase();

      var icon = document.createElement("i");
      icon.className = getIconName(condition.code);
      document.querySelector("#icon").appendChild(icon);

    } else {
      injectErrorMessage();
    }
  })
}

populatePage();
