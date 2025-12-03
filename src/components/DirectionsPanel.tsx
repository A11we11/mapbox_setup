"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  onRoute: (start: string, end: string) => void;
}

export default function DirectionsPanel({ onRoute }: Props) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  return (
    <div className="p-4 bg-white dark:bg-neutral-900 shadow-xl rounded-xl w-80 space-y-4">
      <h2 className="font-semibold text-lg">Directions</h2>

      <Input
        value={start}
        onChange={(e) => setStart(e.target.value)}
        placeholder="Start: lon,lat"
      />

      <Input
        value={end}
        onChange={(e) => setEnd(e.target.value)}
        placeholder="End: lon,lat"
      />

      <Button onClick={() => onRoute(start, end)}>Get Route</Button>
    </div>
  );
}
