var api = "http://api.openweathermap.org/data/2.5/weather?q=";
   var units = "&units=metric";
   var appid = "&APPID=c4cf8fa33e2c8d68b7f5d533459d19d3"

$.getJSON('http://ipinfo.io', function(data){
  console.log(data);
  $('#city').html(data.city + ': ');

  var weatherURI = api + encodeURIComponent(data.city) + units + appid;

  $.getJSON(weatherURI, function (weatherObj) {
    $('#city').append(weatherObj.weather["0"].main + ', ' + weatherObj.main.temp + '&#176;C');
  })
})
