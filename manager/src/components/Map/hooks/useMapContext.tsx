import { useMemo, useContext } from 'react';
import { MapContext } from '../MapContainer/MapContainer';

export const useMapContext = () => {
  const context = useContext(MapContext);
  return useMemo(() => {
    return context || {};
  }, [context]);
};
