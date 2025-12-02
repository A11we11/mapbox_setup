// hooks/useMapInteraction.ts
import { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

/**
 * useMapInteraction Hook
 *
 * PURPOSE: Tracks user interactions with the map
 * TRACKS: Dragging, zooming, viewport changes
 * USE CASE: Analytics, saving user preferences, syncing map state
 */
export function useMapInteraction(map: mapboxgl.Map | null) {
  const [isMoving, setIsMoving] = useState(false);
  const [zoom, setZoom] = useState(9);
  const [center, setCenter] = useState<[number, number]>([3.3792, 6.5244]);

  useEffect(() => {
    if (!map) return;

    const handleMoveStart = () => setIsMoving(true);
    const handleMoveEnd = () => {
      setIsMoving(false);
      setZoom(map.getZoom());
      const { lng, lat } = map.getCenter();
      setCenter([lng, lat]);
    };

    map.on("movestart", handleMoveStart);
    map.on("moveend", handleMoveEnd);
    map.on("zoomend", handleMoveEnd);

    return () => {
      map.off("movestart", handleMoveStart);
      map.off("moveend", handleMoveEnd);
      map.off("zoomend", handleMoveEnd);
    };
  }, [map]);

  return { isMoving, zoom, center };
}
