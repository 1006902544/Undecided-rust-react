import React, { useCallback } from 'react';
// import { Circle, LayerGroup, LayersControl } from 'react-leaflet';
// import { LayersControl } from 'react-leaflet';
import { MapControllerInterface } from './index.d';
import { createPortal } from 'react-dom';
import { useMapContext } from '../hooks';
import focusPng from '../assets/focus.png';

export default function ControllerPortal({
  open = true,
}: MapControllerInterface) {
  return open
    ? createPortal(<Controller />, document.querySelector('.map-wrapper')!)
    : null;
}

const Controller = () => {
  const { map, position } = useMapContext();

  const focusToPoint = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!position || !map) return;
      e.nativeEvent.preventDefault();
      if (position) {
        map.setView(position, map.getZoom(), {
          animate: true,
        });
      }
    },
    [map, position]
  );

  return (
    <div
      className="point-to-center bg-[rgba(0,0,0,.5)] w-[30px] h-[30px] rounded-[5px] cursor-pointer z-[400] absolute right-[20px] bottom-[60px] hover:bg-[rgba(0,0,0,.7)] active:scale-90"
      onClick={focusToPoint}
    >
      <img src={focusPng} alt="" />
    </div>
  );
};
