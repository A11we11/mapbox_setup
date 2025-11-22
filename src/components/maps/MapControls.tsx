"use client";

import { useEffect } from "react";
import mapboxgl from "mapbox-gl";

interface MapControlsProps {
  map: mapboxgl.Map | null;
}
export default function MapControls({ map }: MapControlsProps) {
  useEffect(() => {
    if (!map) return;
    // Navigation controls (zoom, rotate)
    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav, "bottom-right");

    // Fullscreen control
    const fullscreen = new mapboxgl.FullscreenControl();
    map.addControl(fullscreen, "bottom-right");

    // Geolocation control
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserHeading: true,
    });
    map.addControl(geolocate, "bottom-right");

    //scale control
    const scale = new mapboxgl.ScaleControl({
      maxWidth: 80,
      unit: "metric",
    });
    map.addControl(scale, "bottom-left");

    return () => {
      map.removeControl(nav);
      map.removeControl(fullscreen);
      map.removeControl(geolocate);
      map.removeControl(scale);
    };
  }, [map]);

  return null;
}
