"use client";

import { useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";

export function useMapbox() {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  const addMarker = useCallback(
    (coordinates: [number, number], options?: mapboxgl.MarkerOptions) => {
      if (!map) return;
      const marker = new mapboxgl.Marker(options)
        .setLngLat(coordinates)
        .addTo(map);
    },
    [map]
  );

  const flyTo = useCallback(
    (coordinates: [number, number], zoom?: number) => {
      if (!map) return;
      map.flyTo({
        center: coordinates,
        zoom: zoom || map?.getZoom(),
        duration: 2000,
      });
    },
    [map]
  );

  const addGeoJSON = useCallback(
    (id: string, data: GeoJSON.GeoJSON) => {
      if (!map) return;

      if (map.getSource(id)) {
        (map.getSource(id) as mapboxgl.GeoJSONSource).setData(data);
      } else {
        map.addSource(id, {
          type: "geojson",
          data,
        });
      }
    },
    [map]
  );

  return {
    map,
    setMap,
    addMarker,
    flyTo,
    addGeoJSON,
  };
}
