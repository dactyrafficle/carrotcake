# carrotcake

im trying to find a good way to look at container ports in Canada and the US and the kind of volume they see and where things go etc

https://dactyrafficle.github.io/carrotcake/

## Canada

There are 4 big ports:
* Vancouver, BC
* Montreal, QC
* Halifax, NS
* Prince Rupert, BC

Attempt | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 | #11
--- | --- | --- | --- |--- |--- |--- |--- |--- |--- |--- |---
Seconds | 301 | 283 | 290 | 286 | 289 | 285 | 287 | 287 | 272 | 276 | 269

There are lots of seaports in Canada, but there are 17 port authorities that are owned by the Government of Canada and run as Crown Corporations. The 4 listed above fall under this category.

The list is here:

https://tc.canada.ca/en/marine-transportation/ports-harbours-anchorages/list-canada-port-authorities

apparently, there are 360 commercial ports in the US

Make sure that latitude is the first column, and latitude is the second column.

Latitude goes from -90 to 90 degrees.
The North Pole has a latitude of 90 degrees.
The Equator has a latitude of 0 degrees.
The South Pole has a latitude of -90 degrees.

![](images/latitude.png)

Longitude goes from -180 to 180 degrees.

Hamilton, Ontario has coordinated 43.2557 N and 79.8711 W

In this file I need to represent that as (43.2557,-79.8711) because the negative segment of Longitude, -180 <= x < 0 can be represented as |x| or Math.abs(x) or the absolute value of x West.


