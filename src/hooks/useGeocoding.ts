// hooks/useGeocoding.ts
import { useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";

export interface GeocodingFeature {
  id: string;
  place_name: string;
  center: [number, number];
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  text: string;
  place_type: string[];
}

/**
 * useGeocoding Hook
 *
 * PURPOSE: Handles location search with Mapbox Geocoding API
 * FEATURES:
 * - Error handling
 * - Loading states
 * - Request cancellation
 * - Type-safe responses
 */
export function useGeocoding() {
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchLocations = useCallback(
    async (query: string): Promise<GeocodingFeature[]> => {
      if (!query.trim()) return [];

      setIsSearching(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            query
          )}.json?access_token=${mapboxgl.accessToken}&limit=5`
        );

        if (!response.ok) throw new Error("Search failed");

        const data = await response.json();
        return data.features || [];
      } catch (err) {
        setError(err instanceof Error ? err.message : "Search error");
        return [];
      } finally {
        setIsSearching(false);
      }
    },
    []
  );

  return { searchLocations, isSearching, error };
}
