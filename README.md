# Local Weather

## Detects your location and displays current weather

I chose the APIs I did because of their free SSL support. V1 used <http://ipinfo.io> and <http://openweathermap.com>.
Now using <https://freegeoip.net> for location and <https://query.yahooapis.com> for weather.
Also using <http://nominatim.openstreetmap.org> for reverse geocoding, in cases where the city is not detected from IP request.

Don't want to include jQuery just for `$.getJSON` and `$.ajax`, <http://youmightnotneedjquery.com/> to the rescue.

# Todo

- inject error if no data via JS - delete everything and create on element that says sorry.
- (maybe) background color conditional on weather - rainy dark blue, fog or cloudy grey, sunny yellow, snow bright blue.
