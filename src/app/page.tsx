"use client";

import MapControls from "@/components/maps/MapControls";
import MapMarker from "@/components/maps/MapMarker";
import MapSearch from "@/components/maps/MapSearch";
import MapStyles from "@/components/maps/MapStyles";
import { useMapbox } from "@/hooks/useMapbox";
import dynamic from "next/dynamic";
import "mapbox-gl/dist/mapbox-gl.css";
import { Loader } from "lucide-react";

/**
 * Dynamic import prevents SSR issues with Mapbox GL
 * Shows loading state while map initializes
 */
// Dynamically import to avoid SSR issues

const Map = dynamic(() => import("@/components/maps/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader className="animate-spin mx-auto" />
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const { map, setMap, addMarker } = useMapbox();

  return (
    <main className="w-full h-screen relative">
      <Map
        initialCenter={[3.3792, 6.5244]}
        initialZoom={9}
        onMapLoad={setMap}
      />

      {map && (
        <>
          <MapControls map={map} />
          <MapSearch map={map} />
          <MapStyles map={map} />

          {/* Example markers */}
          <MapMarker
            map={map}
            coordinates={[-74.5, 40]}
            color="#ef4444"
            popup="<h3>Example Location</h3><p>This is a sample marker</p>"
          />
        </>
      )}
    </main>
  );
}
