import React, { useState, createContext, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { Controller, Marker } from '../';
import type { MapContainerInterface, MapNodeInterface } from './MapContainer.d';
import type { LatLng } from 'leaflet';
import { MapContextInterface } from '../index.d';
import styled from 'styled-components';

export const MapContext = createContext<MapContextInterface>({
  map: null,
  position: null,
  setPosition: null,
});

export default function Map({
  width = '100%',
  height = '100%',
  onChange,
  value,
}: MapContainerInterface) {
  //position for preview
  const [position, setPosition] = useState<LatLng | null>(null);

  useEffect(() => {
    onChange?.(position);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position]);

  return (
    <Styled
      className="map-wrapper border-[1px] border-[gray] rounded-[5px] overflow-hidden relative"
      style={{ width, height }}
    >
      <MapContainer
        center={{ lat: 51.505, lng: -0.09 }}
        zoom={13}
        scrollWheelZoom={true}
        style={{ width, height: `calc(${height} - 40px)` }}
      >
        <MapNode
          value={value}
          onPositionChange={(v) => {
            setPosition(v);
          }}
        />
      </MapContainer>
      <div className="h-[40px] leading-[40px] text-end pr-[30px]">
        latitude: {position?.lat.toFixed(4)}, longitude:{' '}
        {position?.lng.toFixed(4)}{' '}
      </div>
    </Styled>
  );
}

const MapNode = ({ onPositionChange, value }: MapNodeInterface) => {
  //map
  const map = useMapEvents({
    click(e) {
      map.setView(e.latlng, map.getZoom(), {
        animate: true,
      });
      setPosition(e.latlng);
    },
  });

  //position
  const [position, setPosition] = useState<LatLng | null>(value || null);

  useEffect(() => {
    onPositionChange(position);
    if (position) {
      map.setView(position, map.getZoom(), {
        animate: true,
      });
    }
  }, [onPositionChange, position, map]);

  return (
    <MapContext.Provider value={{ map, position, setPosition }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker />

      <Controller />
    </MapContext.Provider>
  );
};

const Styled = styled.div`
  .leaflet-control {
    > a {
      background-color: rgba(0, 0, 0, 0.5);
      color: white;

      &:hover {
        background-color: rgba(0, 0, 0, 0.7);
      }
    }
  }
`;
