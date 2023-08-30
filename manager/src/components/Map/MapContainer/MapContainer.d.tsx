import type { LatLng } from 'leaflet';

export interface MapContainerInterface {
  width?: number | string;
  height?: number | string;
  onChange?: (value: LatLng | null) => void;
  value?: LatLng | null;
}

export interface MapNodeInterface {
  onPositionChange: (latLng: LatLng | null) => void;
  value?: LatLng | null;
}
