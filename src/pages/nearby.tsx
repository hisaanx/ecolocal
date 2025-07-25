import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

function getDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
    );
    const data = await res.json();
    return data.display_name || "Address not found";
  } catch {
    return "Address not found";
  }
}

type Spot = {
  id: string;
  name: string;
  type: string;
  lat: number;
  lon: number;
  distance: number;
  address?: string;
  description?: string;
  source?: "user" | "api";
};

function prettyType(type: string) {
  switch (type) {
    case "recycling":
      return "♻️ Recycling Center";
    case "second_hand":
      return "🛍️ Thrift / Charity Shop";
    case "bicycle_rental":
      return "🚲 Bicycle Rental";
    case "bicycle_shop":
      return "🔧 Bike Repair Shop";
    case "eco_spot":
      return "🌱 Eco-Friendly Spot";
    default:
      return "🌿 Eco Spot";
  }
}

export default function NearbySpots() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null
  );
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    type: "recycling",
    description: "",
    location: "",
    submittedBy: "",
  });

  const handleSuggest = async () => {
    if (!form.name || !form.location) {
      alert("Please fill in name and location.");
      return;
    }

    const encoded = encodeURIComponent(form.location);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data || !data[0]) {
      alert("❌ Could not find that address. Try again.");
      return;
    }

    const { lat, lon } = data[0];

    const newSpot = {
      name: form.name,
      type: form.type,
      description: form.description,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      submittedBy: form.submittedBy || "anon",
      timestamp: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "suggested_spots"), newSpot);
      alert("✅ Spot submitted!");
      setForm({
        name: "",
        type: "recycling",
        description: "",
        location: "",
        submittedBy: "",
      });
    } catch (err) {
      console.error("Error adding suggestion:", err);
      alert("❌ Failed to submit");
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const userLoc = {
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
      };
      setLocation(userLoc);

      const categories = [
        { key: "recycling", query: 'node["amenity"="recycling"]' },
        {
          key: "second_hand",
          query: `
            (
              node["shop"="second_hand"];
              node["shop"="charity"];
              node["second_hand"="yes"];
              node["reuse"="yes"];
              way["shop"="second_hand"];
              way["shop"="charity"];
              relation["shop"="charity"];
            )
          `,
        },
        { key: "bicycle_rental", query: 'node["amenity"="bicycle_rental"]' },
        { key: "bicycle_shop", query: 'node["shop"="bicycle"]' },
        {
          key: "eco_spot",
          query: `
            (
              node["organic"="yes"];
              node["sustainable"="yes"];
              node["amenity"="cafe"]["organic"="yes"];
              node["shop"="organic"];
            )
          `,
        },
      ];

      let allSpots: Spot[] = [];

      for (const cat of categories) {
        const radiusSteps = [2000, 5000, 10000, 20000, 30000];
        let found: Spot[] = [];

        for (const radius of radiusSteps) {
          const query = `
            [out:json];
            ${cat.query}(around:${radius},${userLoc.lat},${userLoc.lon});
            out center;
          `;

          try {
            const res = await fetch("https://overpass-api.de/api/interpreter", {
              method: "POST",
              body: query,
            });
            const data = await res.json();

            found = data.elements
              .filter((el: any) => el.tags?.name && (el.lat || el.center))
              .map((el: any) => {
                const lat = el.lat || el.center?.lat;
                const lon = el.lon || el.center?.lon;

                return {
                  id: `${cat.key}-${el.id}`,
                  name: el.tags.name,
                  type: cat.key,
                  lat,
                  lon,
                  distance: getDistanceKm(userLoc.lat, userLoc.lon, lat, lon),
                  source: "api",
                };
              })
              .sort((a: Spot, b: Spot) => a.distance - b.distance);

            if (found.length >= 3) {
              found = found.slice(0, 3);
              break;
            }
          } catch (err) {
            console.warn(`❌ Failed to fetch ${cat.key} at radius ${radius}`);
          }
        }

        allSpots.push(...found);
      }

      const userSpotsSnapshot = await getDocs(
        collection(db, "suggested_spots")
      );
      const userSpots: Spot[] = userSpotsSnapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          name: d.name,
          type: d.type,
          lat: d.lat,
          lon: d.lon,
          description: d.description || "",
          distance: getDistanceKm(userLoc.lat, userLoc.lon, d.lat, d.lon),
          source: "user",
        };
      });

      let combined = [...allSpots, ...userSpots];
      combined.sort((a: Spot, b: Spot) => a.distance - b.distance);

      const withAddresses = await Promise.all(
        combined.map(async (spot, i) => {
          if (i >= 6) return { ...spot, address: "Address loading..." };
          const address = await reverseGeocode(spot.lat, spot.lon);
          return { ...spot, address };
        })
      );

      setSpots(withAddresses);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen px-6 pt-24 pb-20 bg-transparent">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-quicksand font-semibold text-center mb-10 flex items-center justify-center gap-2">
          <span className="text-4xl">🌍</span>
          <span className="bg-gradient-to-r from-green-500 to-blue-500 text-transparent bg-clip-text">
            Nearby Eco Spots
          </span>
        </h1>

        {loading ? (
          <div className="animate-pulse text-gray-400">
            Loading nearby eco spots...
          </div>
        ) : spots.length > 0 ? (
          <ul className="space-y-4">
            {spots.map((spot) => (
              <li
                key={spot.id}
                className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500"
              >
                <h2 className="text-lg font-semibold text-green-700">
                  {spot.name}
                </h2>
                <p className="text-gray-600 text-sm">{prettyType(spot.type)}</p>
                {spot.description && (
                  <p className="text-gray-600 text-sm italic">
                    {spot.description}
                  </p>
                )}
                <p className="text-gray-500 text-sm">
                  {spot.distance.toFixed(2)} km away
                </p>
                <p className="text-gray-400 text-xs">{spot.address}</p>
                {spot.source === "user" && (
                  <p className="text-xs text-blue-500 mt-1">
                    🧑‍💻 Community submitted
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700">No eco spots found nearby.</p>
        )}

        {/* 💡 Suggest a New Spot (below list) */}
        <div className="mt-12 bg-white p-6 rounded-xl border border-blue-400 shadow-md hover:shadow-lg hover:scale-[1.01] transition duration-200">
          <h2 className="text-lg font-bold text-blue-700 flex items-center gap-2 mb-4">
            💡 Suggest a New Spot
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              placeholder="Place Name"
              className="border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-900 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <select
              className="border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="recycling">♻️ Recycling Center</option>
              <option value="second_hand">🛍️ Thrift / Charity Shop</option>
              <option value="bicycle_rental">🚲 Bicycle Rental</option>
              <option value="bicycle_shop">🔧 Bike Repair Shop</option>
              <option value="eco_spot">🌱 Eco-Friendly Spot</option>
            </select>
            <input
              type="text"
              placeholder="Description (optional)"
              className="border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-900 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Postcode or Address (e.g. SE1 7PB)"
              className="border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-900 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
            <input
              type="text"
              placeholder="Your name (or 'anon')"
              className="border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-900 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={form.submittedBy}
              onChange={(e) =>
                setForm({ ...form, submittedBy: e.target.value })
              }
            />
            <button
              onClick={handleSuggest}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md shadow-sm transition hover:shadow-lg hover:ring-2 hover:ring-green-400"
            >
              ✅ Submit Spot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
