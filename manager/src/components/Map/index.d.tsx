import type { LatLng, Map } from 'leaflet';

export interface MapContextInterface {
  map: Map | null;
  position: LatLng | null;
  setPosition: React.Dispatch<React.SetStateAction<LatLng | null>> | null;
}
