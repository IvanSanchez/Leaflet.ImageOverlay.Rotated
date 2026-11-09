import type {
  ImageOverlay,
  ImageOverlayDefaults,
  ImageOverlayEventMap,
  ImageOverlayOptions,
  LatLngExpression,
} from "leaflet";

/** A rotated/skewed image overlay, positioned by three corner points. */
export class ImageOverlayRotated<
  O extends ImageOverlayOptions = ImageOverlayOptions,
  E extends ImageOverlayEventMap = ImageOverlayEventMap,
> extends ImageOverlay<O & ImageOverlayDefaults, E> {
  constructor(
    image: string | HTMLImageElement | HTMLCanvasElement,
    topleft: LatLngExpression,
    topright: LatLngExpression,
    bottomleft: LatLngExpression,
    options?: O,
  );

  reposition(
    topleft: LatLngExpression,
    topright: LatLngExpression,
    bottomleft: LatLngExpression,
  ): void;
}

export function imageOverlayRotated(
  imgSrc: string | HTMLImageElement | HTMLCanvasElement,
  topleft: LatLngExpression,
  topright: LatLngExpression,
  bottomleft: LatLngExpression,
  options?: ImageOverlayOptions,
): ImageOverlayRotated;
