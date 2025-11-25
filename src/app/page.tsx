"use client";
import MapControls from "@/components/maps/MapControls";
import MapMarker from "@/components/maps/MapMarker";
import MapSearch from "@/components/maps/MapSearch";
import { useMapbox } from "@/hooks/useMapbox";
import dynamic from "next/dynamic";

// Dynamically import to avoid SSR issues
const Map = dynamic(() => import("@/components/maps/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center">
      <p>Loading map...</p>
    </div>
  ),
});

export default function Home() {
  const { map, setMap, addMarker } = useMapbox();

  return (
    <main className="w-full h-screen relative">
      <Map initialCenter={[-74.5, 40]} initialZoom={9} onMapLoad={setMap} />

      {map && (
        <>
          <MapControls map={map} />
          <MapSearch map={map} />

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
