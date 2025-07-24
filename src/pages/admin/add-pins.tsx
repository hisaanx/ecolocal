// pages/admin/add-pins.tsx
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import Link from "next/link";

const AddPins = () => {
  const handleAddPins = async () => {
    const spots = [
  // London
  {
    type: "recycling",
    lat: 51.5079,
    lng: -0.1281,
    name: "♻️ City Recycling Center",
    description: "Drop off plastics and glass here.",
  },
  {
    type: "bike",
    lat: 51.505,
    lng: -0.115,
    name: "🚲 CycleShare - Southbank",
    description: "Grab a rental bike 24/7.",
  },
  {
    type: "thrift",
    lat: 51.512,
    lng: -0.123,
    name: "🛍️ Green Threads Thrift",
    description: "Second-hand clothes and goods.",
  },

  // Manchester
  {
    type: "thrift",
    lat: 53.481,
    lng: -2.242,
    name: "🛍️ Manc Eco Threads",
    description: "Eco-friendly thrift store in Manchester.",
  },
  {
    type: "bike",
    lat: 53.4808,
    lng: -2.2451,
    name: "🚲 Manchester Bike Dock",
    description: "Bikes available 24/7.",
  },
  {
    type: "recycling",
    lat: 53.483,
    lng: -2.239,
    name: "♻️ Northern Quarter Recycle Hub",
    description: "Glass and paper accepted.",
  },

  // Birmingham
  {
    type: "bike",
    lat: 52.4862,
    lng: -1.8904,
    name: "🚲 CycleBirmingham Dock",
    description: "Grab a bike in central Birmingham.",
  },
  {
    type: "recycling",
    lat: 52.488,
    lng: -1.895,
    name: "♻️ Bullring Recycling",
    description: "Bins near the shopping center entrance.",
  },
  {
    type: "thrift",
    lat: 52.489,
    lng: -1.884,
    name: "🛍️ Birmingham Bargain Closet",
    description: "Thrift fashion for all.",
  },

  // Glasgow
  {
    type: "recycling",
    lat: 55.8642,
    lng: -4.2518,
    name: "♻️ Glasgow Recycling Hub",
    description: "Mixed material recycling point.",
  },
  {
    type: "bike",
    lat: 55.862,
    lng: -4.248,
    name: "🚲 Kelvingrove Cycle Dock",
    description: "Rent a bike by the museum.",
  },
  {
    type: "thrift",
    lat: 55.866,
    lng: -4.259,
    name: "🛍️ Retro Revival",
    description: "Local thrift boutique in Glasgow.",
  },

  // Edinburgh
  {
    type: "bike",
    lat: 55.953,
    lng: -3.188,
    name: "🚲 Princes Street Bikes",
    description: "Bike station near Scott Monument.",
  },
  {
    type: "recycling",
    lat: 55.952,
    lng: -3.19,
    name: "♻️ Old Town Recycling Point",
    description: "Near Royal Mile corner.",
  },
  {
    type: "thrift",
    lat: 55.954,
    lng: -3.185,
    name: "🛍️ Second Cycle",
    description: "Upcycled fashion near Waverley.",
  },

  // Bristol
  {
    type: "bike",
    lat: 51.455,
    lng: -2.589,
    name: "🚲 Harbour Cycles",
    description: "Dock at Bristol Harbour.",
  },
  {
    type: "recycling",
    lat: 51.458,
    lng: -2.586,
    name: "♻️ Bristol City Bins",
    description: "Mixed recycling drop off.",
  },

  // Liverpool
  {
    type: "recycling",
    lat: 53.408,
    lng: -2.991,
    name: "♻️ Lime Street Bins",
    description: "Recycling station outside the station.",
  },
  {
    type: "thrift",
    lat: 53.407,
    lng: -2.984,
    name: "🛍️ Mersey Vintage",
    description: "Thrift shop near Albert Dock.",
  },

  // Leeds
  {
    type: "bike",
    lat: 53.8,
    lng: -1.549,
    name: "🚲 Leeds Uni Cycle Dock",
    description: "Students welcome!",
  },

  // Cardiff
  {
    type: "recycling",
    lat: 51.481,
    lng: -3.179,
    name: "♻️ Cardiff Bay EcoPoint",
    description: "Sustainable bin in the square.",
  },

  // Nottingham
  {
    type: "thrift",
    lat: 52.953,
    lng: -1.15,
    name: "🛍️ Notts Vintage Market",
    description: "Open air thrift stalls weekly.",
  },

  // Sheffield
  {
    type: "bike",
    lat: 53.38,
    lng: -1.47,
    name: "🚲 Steel City Cycle",
    description: "Rent a bike downtown.",
  },

  // Brighton
  {
    type: "recycling",
    lat: 50.822,
    lng: -0.137,
    name: "♻️ Brighton Beach Bins",
    description: "Help keep the beach clean.",
  }
];
    for (const spot of spots) {
      await addDoc(collection(db, "ecoSpots"), spot);
    }

    alert("Eco pins added successfully!");
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">🌱 Add Eco Pins</h1>
      <button
        onClick={handleAddPins}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        Add Sample Pins
      </button>

      <div className="mt-6">
        <Link href="/eco-map" className="text-green-700 underline">
          ← Go to Map
        </Link>
      </div>
    </div>
  );
};

export default AddPins;
