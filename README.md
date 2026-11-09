
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

This is an ES module. Import the `imageOverlayRotated` factory (or the
`ImageOverlayRotated` class directly), pass the image URL, the three corner
points and any `ImageOverlay` options:

```js
import { imageOverlayRotated } from 'leaflet-imageoverlay-rotated';

const overlay = imageOverlayRotated('./palacio.jpg',
	[40.52256691873593, -3.7743186950683594],
	[40.5210255066156, -3.7734764814376835],
	[40.52180437272552, -3.7768453359603886],
	{
		opacity: 0.4,
		interactive: true,
		attribution: "&copy; <a href='http://www.ign.es'>Instituto Geográfico Nacional de España</a>"
	}).addTo(map);
```

`topleft`, `topright` and `bottomleft` are `LatLngExpression`s (a `LatLng`, a
`[lat, lng]` tuple or a `{lat, lng}` object), corresponding to the locations of
the corners of the image. These three corners might not necessarily be at the
top or at the left of each other.

Alternatively, the first parameter can be an instance of
[HTMLImage](https://developer.mozilla.org/docs/Web/API/HTMLImageElement) or
`HTMLCanvasElement`.

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

This fork supports **both Leaflet 1.x and 2.x from one release**, following the
"Support 1.x and 2.0 from one release" recipe in
[Leaflet's MIGRATION.md][migration]. It is an ES class (`class ImageOverlayRotated
extends L.ImageOverlay`) using `L.Util.setOptions`, `new L.LatLng(...)`, `new
L.Bounds(...)` and `new L.LatLngBounds(...)` — all of which work on both
versions — instead of the removed `L.Class.extend`/`initialize` and lowercase
factories. It declares `"leaflet": "^1.9.0 || ^2.0.0-beta.1"` as a peer
dependency.

Corner points may be `[lat, lng]` tuples, `{lat, lng}` objects, or `L.LatLng`
instances:

```js
import * as L from 'leaflet';
import { imageOverlayRotated } from 'leaflet-imageoverlay-rotated';

const topleft    = [40.52256691873593, -3.7743186950683594],
      topright   = [40.5210255066156, -3.7734764814376835],
      bottomleft = [40.52180437272552, -3.7768453359603886];

const overlay = imageOverlayRotated("./palacio.jpg", topleft, topright, bottomleft, {
	opacity: 0.4,
	interactive: true
}).addTo(map);
```

[migration]: https://github.com/Leaflet/Leaflet/blob/main/MIGRATION.md#11-support-1x-and-20-from-one-release


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



