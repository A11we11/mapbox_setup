"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { useTheme } from "next-themes";

/* 
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
 */

import DirectionsPanel from "../DirectionsPanel";
import { useMapboxDirections } from "@/hooks/useMapboxDirections";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

interface MapProps {
  initialCenter?: [number, number];
  initialZoom?: number;
  onMapLoad?: (map: mapboxgl.Map) => void;
}

export default function Map({
  initialCenter = [3.3792, 6.5244],
  initialZoom = 9,
  onMapLoad,
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { theme, systemTheme } = useTheme();
  const [mapLoaded, setMapLoaded] = useState(false);

  const currentTheme = theme === "system" ? systemTheme : theme;

  const { getRoute } = useMapboxDirections(map.current);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style:
        currentTheme === "dark"
          ? "mapbox://styles/mapbox/dark-v11"
          : "mapbox://styles/mapbox/light-v11",
      center: initialCenter,
      zoom: initialZoom,
    });

    map.current.on("load", () => {
      setMapLoaded(true);
      if (onMapLoad && map.current) onMapLoad(map.current);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update style when theme changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const newStyle =
      currentTheme === "dark"
        ? "mapbox://styles/mapbox/dark-v11"
        : "mapbox://styles/mapbox/light-v11";

    map.current.setStyle(newStyle);
  }, [mapLoaded, currentTheme]);

  // Mapbox Directions (corrected logic)
  /*   useEffect(() => {
    if (!map.current || !mapLoaded) return;

    if (!directionsRef.current) {
      const directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: "metric",
        profile: "mapbox/driving",
        controls: {
          instructions: true,
          profileSwitcher: true,
        },
      });

      directionsRef.current = directions;
      map.current.addControl(directions, "top-right");
    }

    return () => {
      if (map.current && directionsRef.current) {
        map.current.removeControl(directionsRef.current);
        directionsRef.current = null;
      }
    };
  }, [mapLoaded]); */

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      {/* Overlay the custom directions UI */}
      <div className="absolute top-4 right-4 z-50">
        <DirectionsPanel onRoute={getRoute} />
      </div>
    </div>
  );
}
