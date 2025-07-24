// src/hooks/useOverpassSpots.ts
import { useEffect, useState } from "react";
import { LatLngBounds } from "leaflet";
import debounce from "lodash.debounce";

export type OverpassSpot = {
  id: string;
  lat: number;
  lng: number;
  name: string;
  type: "recycling" | "bike" | "thrift";
};

export const useOverpassSpots = (bounds: LatLngBounds | null) => {
  const [spots, setSpots] = useState<OverpassSpot[]>([]);

  const fetchOverpass = async (bbox: string) => {
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="recycling"](${bbox});
        node["amenity"="bicycle_rental"](${bbox});
        node["shop"="second_hand"](${bbox});
        node["shop"="charity"](${bbox});
      );
      out body;
    `;

    const url = "https://overpass-api.de/api/interpreter";
    const response = await fetch(url, {
      method: "POST",
      body: query,
    });

    const data = await response.json();

    const parsed: OverpassSpot[] = data.elements
      .filter((el: any) => el.type === "node")
      .map((el: any) => {
        let type: OverpassSpot["type"] = "recycling";
        if (el.tags?.amenity === "bicycle_rental") type = "bike";
        else if (
          el.tags?.shop === "second_hand" ||
          el.tags?.shop === "charity"
        ) type = "thrift";

        return {
          id: el.id.toString(),
          lat: el.lat,
          lng: el.lon,
          name: el.tags?.name || "Eco Spot",
          type,
        };
      });

    console.log("📍 Overpass results:", parsed);
    setSpots(parsed);
  };

  useEffect(() => {
    if (!bounds) return;

    const southWest = bounds.getSouthWest();
    const northEast = bounds.getNorthEast();
    const bbox = `${southWest.lat - 0.005},${southWest.lng - 0.005},${northEast.lat + 0.005},${northEast.lng + 0.005}`;
    console.log("🗺️ Debounced BBOX:", bbox);

    const debouncedFetch = debounce(() => {
      fetchOverpass(bbox);
    }, 300);

    debouncedFetch();
    return () => debouncedFetch.cancel();
  }, [bounds]);

  return spots;
};
