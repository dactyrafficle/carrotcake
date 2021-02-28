# carrotcake

im trying to find a good way to look at container ports in the US and the kind of volume they see and where things go etc

https://dactyrafficle.github.io/carrotcake/

Make sure that latitude is the first column, and latitude is the second column.

Latitude goes from -90 to 90 degrees.
The North Pole has a latitude of 90 degrees.
The Equator has a latitude of 0 degrees.
The South Pole has a latitude of -90 degrees.

![](images/latitude.png)

Longitude goes from -180 to 180 degrees.

Hamilton, Ontario has coordinated 43.2557 N and 79.8711 W

In this file I need to represent that as (43.2557,-79.8711) because the negative segment of Longitude, -180 <= x < 0 can be represented as |x| or Math.abs(x) or the absolute value of x West.

