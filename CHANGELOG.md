
### 0.3.0

* Port the plugin to Leaflet 2.0: rewrite `L.ImageOverlay.Rotated` as an ES class
  using only Leaflet 2 APIs (`new L.LatLng`, `new L.Bounds`, `new L.LatLngBounds`,
  `L.Util.setOptions`, pointer events). Remove the `L.Class.extend`/`initialize`
  dependency. The `L.imageOverlay.rotated` factory is kept as a compatibility shim.

### 0.2.1 (2019-07-24)

* Update changelog

### 0.2.0 (2019-07-24)

* Use a single CSS transformation matrix instead of translate + skew + scale CSS transforms.
  Prevents a edge case of floating precision loss in Gecko and MSIE due to 32-bit floating
  point operations (#13).

### 0.1.4 (2019-03-01)

* Don't crash on `_reset` when overlay is not on a added to a map by @magnudae

### 0.1.3 (2018-06-14)

* Fixed behaviour of `zIndex` option by @KarloX2

### 0.1.2 (2017-10-09)

* Fixed `setUrl()` (#2)

### 0.1.1

* Ignore demo files from the bower/npm packages
* Leafdoc docstrings around

### 0.1.0

* Initial release

