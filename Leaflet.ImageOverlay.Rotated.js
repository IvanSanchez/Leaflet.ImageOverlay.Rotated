/*
 * 🍂class ImageOverlay.Rotated
 * 🍂inherits ImageOverlay
 *
 * Like `ImageOverlay`, but rotates and skews the image. This is done by using
 * *three* control points instead of *two*.
 *
 * This module supports both Leaflet 1.x and 2.0 from a single ES class, following
 * the "Support 1.x and 2.0 from one release" recipe in Leaflet's MIGRATION.md
 * (https://github.com/Leaflet/Leaflet/blob/main/MIGRATION.md):
 *
 *   - `import * as L from 'leaflet'` and reach classes through the namespace
 *     (1.x is UMD and has no flat named exports);
 *   - an ES `class extends L.ImageOverlay` (not `L.Class.extend`/`initialize`);
 *   - `L.Util.setOptions(this, options)` in the constructor (Layer subclasses
 *     don't apply options via `super()` in either version);
 *   - `new L.LatLng(...)`, `new L.Bounds(...)`, `new L.LatLngBounds(...)` which
 *     work on both versions (the lowercase factories are gone in 2.0).
 *
 * @example
 *
 * ```js
 * import { imageOverlayRotated } from './Leaflet.ImageOverlay.Rotated.js';
 *
 * const overlay = imageOverlayRotated(url, [[lat1,lng1],[lat2,lng2],[lat3,lng3]], {
 * 	opacity: 0.4,
 * 	interactive: true
 * }).addTo(map);
 * ```
 *
 */
import * as L from 'leaflet';

/**
 * Normalize a `LatLngExpression` (a `LatLng`, a `[lat, lng]` tuple or a
 * `{lat, lng}` object) into a `L.LatLng` in a version-safe way. `new L.LatLng(a,
 * b)` accepts a `(lat, lng)` pair on both Leaflet 1.x and 2.0, while the 2.0-only
 * `new L.LatLng(expression)` overload does not exist on 1.x, so we always unpack.
 *
 * @param {import('leaflet').LatLngExpression} value
 * @returns {import('leaflet').LatLng}
 */
function toLatLng(value) {
	if (value instanceof L.LatLng) { return value; }
	if (Array.isArray(value)) { return new L.LatLng(value[0], value[1]); }
	if (value && typeof value === 'object') {
		const lat = value.lat;
		const lng = value.lng != null ? value.lng : value.lon;
		return new L.LatLng(lat, lng);
	}
	return new L.LatLng(value);
}

export class ImageOverlayRotated extends L.ImageOverlay {

	/**
	 * @param {string | HTMLImageElement | HTMLCanvasElement} image the image URL or element
	 * @param {import('leaflet').LatLngExpression} topleft corner of the image
	 * @param {import('leaflet').LatLngExpression} topright corner of the image
	 * @param {import('leaflet').LatLngExpression} bottomleft corner of the image
	 * @param {import('leaflet').ImageOverlayOptions} [options]
	 */
	constructor(image, topleft, topright, bottomleft, options) {
		super();
		L.Util.setOptions(this, options);

		if (typeof image === 'string') {
			this._url = image;
		} else {
			// The first parameter is an instance of HTMLImage or HTMLCanvas.
			this._rawImage = image;
		}

		this._topLeft    = toLatLng(topleft);
		this._topRight   = toLatLng(topright);
		this._bottomLeft = toLatLng(bottomleft);
	}

	getEvents() {
		// `ImageOverlay`'s `getEvents()` already registers `_reset` for `zoom` and
		// `viewreset` on both versions; add `zoomend` for parity with 1.x.
		return Object.assign(super.getEvents(), {
			zoomend: this._reset
		});
	}

	onAdd(map) {
		if (!this._image) {
			this._initImage();

			if (this.options.opacity < 1) {
				this._updateOpacity();
			}
		}

		if (this.options.interactive) {
			this._image.classList.add('leaflet-interactive');
			this.addInteractiveTarget(this._image);
		}

		this.getPane().append(this._image);
		this._reset();
	}

	onRemove(map) {
		// Only delegate to the parent if the image was ever created; `ImageOverlay`
		// `onRemove` calls `this._image.remove()` unguarded and would throw if this
		// layer is removed before `_initImage()` has run.
		if (this._image) {
			super.onRemove(map);
		}
	}

	_initImage() {
		let img = this._rawImage;

		if (this._url) {
			img = L.DomUtil.create('img');
			img.style.display = 'none';	// Hide while the first transform (zero or one frames) is being done

			if (this.options.crossOrigin) {
				img.crossOrigin = '';
			}

			img.src = this._url;
			this._rawImage = img;
		}

		// `this._image` is reused by some of the methods of the parent class and
		// must keep the name, even if it is counter-intuitive.
		const div = this._image = L.DomUtil.create('div',
				'leaflet-image-layer ' + (this._zoomAnimated ? 'leaflet-zoom-animated' : ''));

		this._updateZIndex(); // apply z-index style setting to the div (if defined)

		div.appendChild(img);

		div.onselectstart = L.Util.falseFn;
		div.onpointermove = L.Util.falseFn;

		img.onload = () => {
			this._reset();
			img.style.display = 'block';
			this.fire('load');
		};

		img.alt = this.options.alt;
	}


	_reset() {
		const div = this._image;

		if (!this._map) {
			return;
		}

		// Project control points to layer-pixel coordinates
		const pxTopLeft    = this._map.latLngToLayerPoint(this._topLeft);
		const pxTopRight   = this._map.latLngToLayerPoint(this._topRight);
		const pxBottomLeft = this._map.latLngToLayerPoint(this._bottomLeft);

		// Infer coordinate of bottom right
		const pxBottomRight = pxTopRight.subtract(pxTopLeft).add(pxBottomLeft);

		// pxBounds is mostly for positioning the <div> container
		const pxBounds = new L.Bounds([pxTopLeft, pxTopRight, pxBottomLeft, pxBottomRight]);
		const size = pxBounds.getSize();
		const pxTopLeftInDiv = pxTopLeft.subtract(pxBounds.min);

		// LatLngBounds are needed for (zoom) animations
		this._bounds = new L.LatLngBounds( this._map.layerPointToLatLng(pxBounds.min),
		                                   this._map.layerPointToLatLng(pxBounds.max) );

		L.DomUtil.setPosition(div, pxBounds.min);

		div.style.width  = size.x + 'px';
		div.style.height = size.y + 'px';

		const imgW = this._rawImage.width;
		const imgH = this._rawImage.height;
		if (!imgW || !imgH) {
			return;	// Probably because the image hasn't loaded yet.
		}

		// Sides of the control-point box, in pixels
		// These are the main ingredient for the transformation matrix.
		const vectorX = pxTopRight.subtract(pxTopLeft);
		const vectorY = pxBottomLeft.subtract(pxTopLeft);

		this._rawImage.style.transformOrigin = '0 0';

		// The transformation is an affine matrix that switches
		// coordinates around in just the right way. This is the result
		// of calculating the skew/rotation/scale matrices and simplyfing
		// everything.
		this._rawImage.style.transform = "matrix(" +
			(vectorX.x / imgW) + ', ' + (vectorX.y / imgW) + ', ' +
			(vectorY.x / imgH) + ', ' + (vectorY.y / imgH) + ', ' +
			pxTopLeftInDiv.x + ', ' + pxTopLeftInDiv.y + ')';

	}

	reposition(topleft, topright, bottomleft) {
		this._topLeft    = toLatLng(topleft);
		this._topRight   = toLatLng(topright);
		this._bottomLeft = toLatLng(bottomleft);
		this._reset();
	}

	setUrl(url) {
		this._url = url;

		if (this._rawImage) {
			this._rawImage.src = url;
		}
		return this;
	}

}

/**
 * Factory for a rotated/skewed image overlay, given the image URL (or element)
 * and the `LatLng`s of three of its corners.
 *
 * @param {string | HTMLImageElement | HTMLCanvasElement} imgSrc
 * @param {import('leaflet').LatLngExpression} topleft
 * @param {import('leaflet').LatLngExpression} topright
 * @param {import('leaflet').LatLngExpression} bottomleft
 * @param {import('leaflet').ImageOverlayOptions} [options]
 * @returns {ImageOverlayRotated}
 */
export function imageOverlayRotated(imgSrc, topleft, topright, bottomleft, options) {
	return new ImageOverlayRotated(imgSrc, topleft, topright, bottomleft, options);
}
