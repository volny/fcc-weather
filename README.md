Really simple [OpenweatherAPI](https://openweathermap.org/current#geo) integration.

Can take a lot of code from React example.

Just a big weather icon in the middle of the page + temperature.

Below: Either "We believe you are in xxx. If you prefer you can enter your city here: <input>"
Or: "We don't know where you are. Please enter a city here to see the current weather"

http://ipinfo.io/json?callback=JSON_CALLBACK

```javascript
var api = "http://api.openweathermap.org/data/2.5/weather?q=";
   var units = "&units=metric";
   var appid = "&APPID=061f24cf3cde2f60644a8240302983f2"
   var cb = "&callback=JSON_CALLBACK";
   return $http.jsonp(api + city + units+ appid + cb);

```
```javascript
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    $("#data").html("latitude: " + position.coords.latitude + "<br>longitude: " + position.coords.longitude);
  });
}
```

Forget the whole geolocation navigator thing. This is about connecting 2 APIs together, ipinfo for city -> weather.

Haha, uBlock origin blocks 3rd party requests, including the one to the ipinfo API.
