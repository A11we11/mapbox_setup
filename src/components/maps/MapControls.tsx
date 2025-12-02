"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

interface MapControlsProps {
  map: mapboxgl.Map | null;
}

export default function MapControls({ map }: MapControlsProps) {
  const navRef = useRef<mapboxgl.NavigationControl | null>(null);
  const fullscreenRef = useRef<mapboxgl.FullscreenControl | null>(null);
  const geolocateRef = useRef<mapboxgl.GeolocateControl | null>(null);
  const scaleRef = useRef<mapboxgl.ScaleControl | null>(null);

  useEffect(() => {
    if (!map) return;
    const handleLoad = () => {
      // Create controls once
      navRef.current = new mapboxgl.NavigationControl();
      fullscreenRef.current = new mapboxgl.FullscreenControl();
      geolocateRef.current = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      });
      scaleRef.current = new mapboxgl.ScaleControl({
        maxWidth: 80,
        unit: "metric",
      });

      // Add controls
      map.addControl(navRef.current, "bottom-right");
      map.addControl(fullscreenRef.current, "bottom-right");
      map.addControl(geolocateRef.current, "bottom-right");
      map.addControl(scaleRef.current, "bottom-left");
    };

    // Ensure controls are added only when map is fully ready
    if (map.loaded()) handleLoad();
    else map.on("load", handleLoad);

    // Cleanup
    return () => {
      const controls = [
        navRef.current,
        fullscreenRef.current,
        geolocateRef.current,
        scaleRef.current,
      ];

      controls.forEach((control) => {
        if (control && (control as any)._map) {
          map.removeControl(control);
        }
      });
    };
  }, [map]);

  return null;
}
