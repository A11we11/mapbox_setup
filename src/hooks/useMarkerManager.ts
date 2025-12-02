import { useCallback, useRef } from "react";
import mapboxgl from "mapbox-gl";

/**
 * useMarkerManager Hook
 *
 * PURPOSE: Manages multiple markers efficiently
 * FEATURES:
 * - Add/remove markers
 * - Track all markers
 * - Batch operations
 * - Memory cleanup
 */
export function useMarkerManager(map: mapboxgl.Map | null) {
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());

  const addMarker = useCallback(
    (
      id: string,
      coordinates: [number, number],
      options?: {
        color?: string;
        popup?: string;
        draggable?: boolean;
      }
    ) => {
      if (!map) return null;

      // Remove existing marker with same ID
      const existing = markersRef.current.get(id);
      if (existing) existing.remove();

      const marker = new mapboxgl.Marker({
        color: options?.color || "#3b82f6",
        draggable: options?.draggable || false,
      })
        .setLngLat(coordinates)
        .addTo(map);

      if (options?.popup) {
        marker.setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(options.popup)
        );
      }

      markersRef.current.set(id, marker);
      return marker;
    },
    [map]
  );

  const removeMarker = useCallback((id: string) => {
    const marker = markersRef.current.get(id);
    if (marker) {
      marker.remove();
      markersRef.current.delete(id);
    }
  }, []);

  const clearAllMarkers = useCallback(() => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();
  }, []);

  const getMarker = useCallback((id: string) => {
    return markersRef.current.get(id);
  }, []);

  return { addMarker, removeMarker, clearAllMarkers, getMarker };
}
