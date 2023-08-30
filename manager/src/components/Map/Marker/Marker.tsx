import L from 'leaflet';
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { useMapContext } from '..';

export default function MarkerContainer() {
  const { position } = useMapContext();

  return position === null ? null : (
    <Marker
      position={position}
      icon={L.icon({
        iconUrl: require('../assets/marker.png'),
        iconSize: [30, 30],
      })}
    >
      <Popup>
        latitude:{position.lat.toFixed(4)} , longitude:{position.lng.toFixed(4)}
      </Popup>
    </Marker>
  );
}
