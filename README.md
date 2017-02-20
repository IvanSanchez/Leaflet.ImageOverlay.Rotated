
# Leaflet.ImageOverlay.Rotated

Display rotated and skewed images in your LeafletJS maps.


This LeafletJS plugin adds a new class, `L.ImageOverlay.Rotated`, subclass of
[`L.ImageOverlay`](http://leafletjs.com/reference.html#imageoverlay). The main
difference is that the position of `L.ImageOverlay` is defined by a `L.LatLngBounds`
(the `L.LatLng`s of the top-left and bottom-right corners of the image),
whereas `L.ImageOverlay.Rotated` is defined by **three** points (the `L.LatLng`s
of the top-left, top-right and bottom-left corners of the image).

The image will be rotated *and* skewed (as the three corner points might not form
a 90-degree angle).

## Demo

http://ivansanchez.github.io/Leaflet.ImageOverlay.Rotated/demo.html


### Usage

To instantiate a `L.ImageOverlay.Rotated`, specify the image URL, the three corner
points, and any `L.ImageOverlay` options in the `L.imageOverlay.rotated` factory
method, for example:

```js
var topleft    = L.latLng(40.52256691873593, -3.7743186950683594),
	topright   = L.latLng(40.5210255066156, -3.7734764814376835),
	bottomleft = L.latLng(40.52180437272552, -3.7768453359603886);

var overlay = L.imageOverlay.rotated("./palacio.jpg", topleft, topright, bottomleft, {
	opacity: 0.4,
	interactive: true,
	attribution: "&copy; <a href='http://www.ign.es'>Instituto Geográfico Nacional de España</a>"
}).addTo(map);
```

`topleft`, `topright` and `bottomleft` are instances of `L.LatLng`, corresponding
to the locations of the corners of the image. These three `L.LatLng`s might not
neccesarily be at the top or at the left of each other.

Alternatively, the first parameter to the constructor can be an instance of
[HTMLImage](https://developer.mozilla.org/docs/Web/API/HTMLImageElement).


Additionally, the `reposition` method allows to reset the `LatLng`s for the corner
points, effectively moving the image:

```js
overlay.reposition(updatedTopLeft, updatedTopRight, updatedBottomLeft);
```


### Using the code in other projects

The classic way: copy the `Leaflet.ImageOverlay.Rotate.js` file and include it
in your webpage.

`npm install leaflet-imageoverlay-rotated` can be used to include this project
as a dependency. The `package.json` file will allow webpack/browserify to work
its magic.

There is also some support for Bower (in the form of a `bower.json` file), but
Bower is being deprecated, so NPM is preferred.

This plugin has been tested only with Leaflet 1.0.0-beta and 1.0.0-rc1. Don't
expect it to work with 0.7.x.


### Legalese

The code for this plugin is under a Beerware license:

----------------------------------------------------------------------------

"THE BEER-WARE LICENSE":
<ivan@sanchezortega.es> wrote this file. As long as you retain this notice you
can do whatever you want with this stuff. If we meet some day, and you think
this stuff is worth it, you can buy me a beer in return.

----------------------------------------------------------------------------


The demo uses an historical building plan dated from 1863, from the archives of the
[Instituto Geográfico Nacional de España](http://www.ign.es). These images
are [available under a non-commercial license](http://centrodedescargas.cnig.es/CentroDescargas/cambiarMenu.do?destino=infoCondicionesLicencia).



