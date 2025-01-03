Leaflet.AutoGraticule
=====================

A graticule for maps showing Latitude and Longitude, with automatic adjustment to the zoom level.

Based on [Leaflet.SimpleGraticule](https://github.com/ablakey/Leaflet.SimpleGraticule).

[Demo](https://unpkg.com/leaflet-auto-graticule/example.html)\
[Demo on FacilMap](https://facilmap.org/#3/0.00/0.00/MSfR-grid)

Usage
-----

If you are using a module bundler, you can install Leaflet.AutoGraticule using `npm install -S leaflet-auto-graticule` and use it in your code like so:
```javascript
import AutoGraticule from "leaflet-auto-graticule";

new AutoGraticule().addTo(map);
```

TypeScript is supported. Note that when including Leaflet.AutoGraticule like this, `L.AutoGraticule` is not available on the global `L` leaflet object.

If you want to use Leaflet.AutoGraticule in a static HTML page, load it after Leaflet:
```javascript
<script src="https://unpkg.com/leaflet"></script>
<script src="https://unpkg.com/leaflet-auto-graticule"></script>
<script>
    new L.AutoGraticule().addTo(map);
</script>
```

## Options

```JavaScript
var options = {
    /** Leaflet map event on which to redraw the graticule. */
    redraw: 'moveend',

    /** Minimum distance in pixels between two graticule lines. */
    minDistance: 100
};

new L.AutoGraticule(options).addTo(map);
```
