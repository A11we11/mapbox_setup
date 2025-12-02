// @/hooks/useMapEvent.ts

import mapboxgl from "mapbox-gl";
import { useEffect } from "react";

/**
 * Custom hook to register and clean up Mapbox GL event listeners.
 * @param map The Mapbox map instance.
 * @param event The event type to listen for (e.g., 'moveend', 'click').
 * @param handler The function to call when the event fires.
 */
export function useMapEvent(
  map: mapboxgl.Map | null,
  event: keyof mapboxgl.MapEvents,
  handler: (e: any) => void
) {
  useEffect(() => {
    if (!map) return;

    // Wait for the map to be ready before adding listeners
    const addListener = () => {
      map.on(event, handler);
    };

    if (map.loaded()) {
      addListener();
    } else {
      map.once("load", addListener);
    }

    // Cleanup: Remove the listener when the component unmounts or dependencies change
    return () => {
      if (map) {
        map.off(event, handler);
      }
    };
  }, [map, event, handler]);
}
