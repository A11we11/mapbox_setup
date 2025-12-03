import { useState } from "react";
import mapboxgl from "mapbox-gl";

export function useMapboxDirections(map: mapboxgl.Map | null) {
  const [route, setRoute] = useState<any>(null);

  async function getRoute(start: string, end: string) {
    if (!map) return;

    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start};${end}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

    const res = await fetch(url);
    const data = await res.json();

    const routeData = data.routes[0].geometry;

    // Remove previous route
    if (map.getSource("route")) {
      map.removeLayer("route");
      map.removeSource("route");
    }

    // Add new route to map
    map.addSource("route", {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: routeData,
        properties: {},
      },
    });

    map.addLayer({
      id: "route",
      type: "line",
      source: "route",
      paint: {
        "line-width": 4,
        "line-color": "#3b82f6",
      },
    });

    setRoute(data.routes[0]);
  }

  return { getRoute, route };
}
