function getJSON(url, callback) {
  //http://youmightnotneedjquery.com/#json
  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      callback(JSON.parse(request.responseText));
    } else {
      console.error("reached " + url + ", but it returned an error")
    }
  };

  request.onerror = function() {
    console.error("connection error in request to " + url)
  };

  request.send();
}

function getLocation(callback) {
  var url = "https://freegeoip.net/json/";
  getJSON(url, function(data) {
    if (data.city && data.country_name) {
      callback(data.city + ', ' + data.country_name);
    } else {
      console.debug('no location in IP, reverse geocoding...');
      var baseUrl = "https://nominatim.openstreetmap.org/reverse?format=json"
      var revUrl = baseUrl + '&lat=' + data.latitude + '&lon=' + data.longitude;

      getJSON(revUrl, function(data) {
        callback(data.address.state + ', ' + data.address.country);
      })
    }
  });
}

function getWeather(callback) {
  getLocation(function(location) {
    var query = 'select item.condition from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + location + '")';
    var url = "https://query.yahooapis.com/v1/public/yql" + "?q=" + encodeURIComponent(query) + "&format=json";

    getJSON(url, function(data) {
      var condition = data.query.results.channel.item.condition;
      callback(condition, location);
    })
  })
}

getWeather(function(condition, location) {
    console.log(condition.temp + 'F' + ', ' + condition.text + ' in ' + location + ' on ' + condition.date);
    var _location = document.querySelector('#location');
    var date = document.querySelector('#date');
    var temperature = document.querySelector('#temperature');
    var text = document.querySelector('#text');

    _location.innerHTML = location;
    date.innerHTML = condition.date;
    temperature.innerHTML = condition.temp + 'F';
    text.innerHTML = condition.text;
})
