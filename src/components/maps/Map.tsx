"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { useTheme } from "next-themes";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

interface MapProps {
  initialCenter?: [number, number];
  initialZoom?: number;
  onMapLoad?: (map: mapboxgl.Map) => void;
}

export default function Map({
  initialCenter = [-74.5, 40],
  initialZoom = 9,
  onMapLoad,
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { theme, systemTheme } = useTheme();
  const [mapLoaded, setMapLoaded] = useState(false);

  //Determine the current theme
  const currentTheme = theme === "system" ? systemTheme : theme;

  //initialize map
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
      if (onMapLoad && map.current) {
        onMapLoad(map.current);
      }
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update map style when theme changes

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const newStyle =
      currentTheme === "dark"
        ? "mapbox://styles/mapbox/dark-v11"
        : "mapbox://styles/mapbox/light-v11";

    map.current.setStyle(newStyle);
  }, [mapLoaded, currentTheme]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
