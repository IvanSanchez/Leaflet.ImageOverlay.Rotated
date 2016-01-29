
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
});
```

`topleft`, `topright` and `bottomleft` are instances of `L.LatLng`, corresponding
to the locations of the corners of the image. These three `L.LatLng`s might not
neccesarily be at the top or at the left of each other.



Additionally, the `reposition` method allows to reset the `LatLng`s for the corner
points, effectively moving the image:

```js
overlay.reposition(updatedTopLeft, updatedTopRight, updatedBottomLeft);
```


### Running the demo

* Clone the repo
* `npm install`
* open `demo.html` in a web browser


### Using the code in other projects

Use `npm` to include this project as a dependency. The `package.json` file
will allow webpack/browserify to work its magic.

No plans to support bower, as it is being deprecated quite fast.


### Legalese

The demo uses an historical building plan dated from 1863, from the archives of the 
[Instituto Geográfico Nacional de España](http://www.ign.es). These images
are [available under a non-commercial license](http://centrodedescargas.cnig.es/CentroDescargas/cambiarMenu.do?destino=infoCondicionesLicencia).



