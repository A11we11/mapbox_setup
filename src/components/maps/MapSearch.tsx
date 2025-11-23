"use client";

import { useState } from "react";
import mapboxgl from "mapbox-gl";

interface MapSearchProps {
  map: mapboxgl.Map | null;
}

interface SearchResult {
  id: string;
  place_name: string;
  center: [number, number];
}

export default function MapSearch({ map }: MapSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchPlaces = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    setIsSearching(true);

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchQuery
        )}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      setResults(data.features || []);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelect = (result: SearchResult) => {
    if (!map) return;
    map.flyTo({ center: result.center, zoom: 14, duration: 2000 });

    // Add marker at selected location
    new mapboxgl.Marker()
      .setLngLat(result.center)
      .setPopup(new mapboxgl.Popup().setHTML(`<h3>${result.place_name}</h3>`))
      .addTo(map);

    setQuery("");
    setResults([]);
  };
  return (
    <div className="absolute top-4 left-4 z-10 w-80">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            searchPlaces(e.target.value);
          }}
          placeholder="Search location..."
          className="w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        />
        {isSearching && (
          <div className="px-4 py-2 text-sm text-gray-500">Searching...</div>
        )}

        {results.length > 0 && (
          <div className="max-h-60 overflow-y-auto border-t dark:border-gray-700">
            {results.map((result) => (
              <button
                key={result.id}
                onClick={() => handleSelect(result)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="text-sm dark:text-white">
                  {result.place_name}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
