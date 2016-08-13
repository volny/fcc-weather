function getJSON(url, callback) {
  //http://youmightnotneedjquery.com/#json
  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      callback(JSON.parse(request.responseText));
    } else {
      console.error("reached" + url + ", but it returned an error")
    }
  };

  request.onerror = function() {
    console.error("connection error in request to" + url)
  };

  request.send();
}

function getCity(callback) {
  var url = "https://freegeoip.net/json/";
  getJSON(url, function(data) {
    if (data.city) {
      callback(data.city + ', ' + data.country_name);
    } else {
      console.debug('no city in IP, reverse geocoding...');
      var baseUrl = "https://nominatim.openstreetmap.org/reverse?format=json"
      var revUrl = baseUrl + '&lat=' + data.latitude + '&lon=' + data.longitude;

      getJSON(revUrl, function(data) {
        callback(data.address.state + ', ' + data.address.country);
      })
    }
  });
}

getCity(function(city) {
  var query = 'select item.condition from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + city + '")';
  var url = "https://query.yahooapis.com/v1/public/yql" + "?q=" + encodeURIComponent(query) + "&format=json";

  getJSON(url, function(data) {
    var condition = data.query.results.channel.item.condition;
    console.log(condition.temp + 'F' + ', ' + condition.text + ' in ' + city + ' on ' + condition.date);
  })
})
