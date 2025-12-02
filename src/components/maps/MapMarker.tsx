"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

interface MapMarkerProps {
  map: mapboxgl.Map | null;
  coordinates: [number, number];
  color?: string;
  popup?: string | HTMLElement;
  draggable?: boolean;
  onDragEnd?: (lngLat: mapboxgl.LngLat) => void;
}

export default function MapMarker({
  map,
  coordinates,
  color = "#3b82f6",
  popup,
  draggable = false,
  onDragEnd,
}: MapMarkerProps) {
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!map) return;
    // Create marker
    markerRef.current = new mapboxgl.Marker({
      color,
      draggable,
    })
      .setLngLat(coordinates)
      .addTo(map);

    // Add popup if provided

    if (popup) {
      // --- CRUCIAL CHANGE HERE: Add the custom className option ---
      const mapPopup = new mapboxgl.Popup({
        offset: 25,
        className: "mapboxgl-custom-popup", // Add your custom class
      }).setHTML(typeof popup === "string" ? popup : "");
      markerRef.current.setPopup(mapPopup);
    }

    /*  if (popup) {
      const mapPopup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        typeof popup === "string" ? popup : ""
      );
      markerRef.current.setPopup(mapPopup);
    } */

    // Handle drag end

    if (draggable && onDragEnd) {
      markerRef.current.on("dragend", () => {
        const lngLat = markerRef.current!.getLngLat();
        onDragEnd(lngLat);
      });
    }

    return () => {
      markerRef.current!.remove();
    };
  }, [draggable, onDragEnd, coordinates, color, popup, map]);

  return null;
}
