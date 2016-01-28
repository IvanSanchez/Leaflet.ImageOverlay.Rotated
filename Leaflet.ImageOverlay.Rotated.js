
L.ImageOverlay.Rotated = L.ImageOverlay.extend({
	
	initialize(imgSrc, topleft, topright, bottomleft, options) {
		
		this._url = imgSrc;
		
		this._topLeft    = L.latLng(topleft);
		this._topRight   = L.latLng(topright);
		this._bottomLeft = L.latLng(bottomleft);
		
		L.setOptions(this, options);
	},
	
	
	onAdd: function (map) {
		if (!this._image) {
			this._initImage();

			if (this.options.opacity < 1) {
				this._updateOpacity();
			}
		}

		if (this.options.interactive) {
			L.DomUtil.addClass(this._image, 'leaflet-interactive');
			this.addInteractiveTarget(this._image);
		}

		map.on('zoomend resetview', this._reset, this);
		
		this.getPane().appendChild(this._image);
		this._reset();
	},
	
	
	_initImage: function () {
		var img = this._rawImage = L.DomUtil.create('img', 'leaflet-image-layer');
		
		// this._image is reused by some of the methods of the parent class.
		var div = this._image = L.DomUtil.create('div',
				'leaflet-image-layer ' + (this._zoomAnimated ? 'leaflet-zoom-animated' : ''));

		div.appendChild(img);
		
// 		div.style.border = '1px solid black';
		div.style.background = 'rgba(0,0,0,0.2)';
		
		div.onselectstart = L.Util.falseFn;
		div.onmousemove = L.Util.falseFn;

// 		img.onload = L.bind(this.fire, this, 'load');
		img.onload = function(){
			console.log('raw image loaded');
			this._reset();
			this.fire('load');
		}.bind(this);

		img.style.border = '1px solid red';
		
		if (this.options.crossOrigin) {
			img.crossOrigin = '';
		}

		img.src = this._url;
		img.alt = this.options.alt;
		},

	
	_reset: function () {
		var div = this._image;
		
		// Project control points to container-pixel coordinates
		var pxTopLeft    = this._map.latLngToLayerPoint(this._topLeft);
		var pxTopRight   = this._map.latLngToLayerPoint(this._topRight);
		var pxBottomLeft = this._map.latLngToLayerPoint(this._bottomLeft);
		
		// Infer coordinate of bottom right
		var pxBottomRight = pxTopRight.subtract(pxTopLeft).add(pxBottomLeft);
		
		// pxBounds is mostly for positioning the <div> container
		var pxBounds = L.bounds([pxTopLeft, pxTopRight, pxBottomLeft, pxBottomRight]);
		var size = pxBounds.getSize();
		var pxTopLeftInDiv = pxTopLeft.subtract(pxBounds.min);
		
		// Calculate the skew angles, both in X and Y
		var vectorX = pxTopRight.subtract(pxTopLeft);
		var vectorY = pxBottomLeft.subtract(pxTopLeft);
		var skewX = Math.atan2( vectorX.y, vectorX.x );
		var skewY = Math.atan2( vectorY.x, vectorY.y );

		// LatLngBounds used for animations
		this._bounds = L.latLngBounds( this._map.layerPointToLatLng(pxBounds.min),
		                               this._map.layerPointToLatLng(pxBounds.max) );
		
		L.DomUtil.setPosition(div, pxBounds.min);

		div.style.width  = size.x + 'px';
		div.style.height = size.y + 'px';
		
		var imgW = this._rawImage.width;
		var imgH = this._rawImage.height;
		if (!imgW || !imgH) {
			return;	// Probably because the image hasn't loaded yet.
		}
		
// 		console.log('raw image is', this._rawImage);
// 		console.log('raw image dimensions ', imgH, imgW);
		
		var scaleX = pxTopLeft.distanceTo(pxTopRight) / imgW * Math.cos(skewX)/* * Math.sin(skewY)*/;
		var scaleY = pxTopLeft.distanceTo(pxBottomLeft) / imgH * Math.cos(skewY) /** Math.sin(skewY)*/;
		
		function rad2deg (angle) {
			return angle * (180 / Math.PI);
		}
		
		console.log('Skew X: ', rad2deg(skewX), 'sin:', Math.cos(skewX));
		console.log('Skew Y: ', rad2deg(skewY));
		
		this._rawImage.style.transformOrigin = '0 0';
// 		this._rawImage.style.transformOrigin = (size.x/2) + 'px ' + (size.y/2) + 'px';
		
// 		L.DomUtil.setPosition(this._rawImage, (pxTopLeftInDiv.x) + 'px ' + (pxTopLeftInDiv.y) + 'px';
		
		this._rawImage.style.transform = 
			'translate(' + pxTopLeftInDiv.x + 'px, ' + pxTopLeftInDiv.y + 'px)' +
			'skew(' + skewY + 'rad, ' + skewX + 'rad) ' +
// 			'skewY(' + skewX + 'rad) ' +
// 			'skew(-72deg, 72deg) ' +
// 			'scale(' + scaleX * Math.sin(skewX) + ', ' + scaleY * Math.sin(skewY) + ') ' +
			'scale(' + scaleX + ', ' + scaleY + ') ' +
// 			'translate(' + (-imgW/2) + 'px, ' + (-imgH/2) + 'px)';
			'';
			
// 		this._rawImage.style.transform = 
// 			'skew(' + skewX + 'rad, ' + skewY + 'rad) ' +
// 			'scale(' + scaleX + ', ' + scaleY + ') ' +
// 			'translate(' + (-imgW/2) + 'px, ' + (-imgH/2) + 'px)';

	},
	
});











L.imageOverlay.rotated = function(imgSrc, topleft, topright, bottomleft, options) {
	return new L.ImageOverlay.Rotated(imgSrc, topleft, topright, bottomleft, options);
};
