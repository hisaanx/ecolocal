// src/pages/admin/seed.tsx
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

const challenges = [
  {
    title: "Bring Your Own Bag",
    description: "Use a reusable bag instead of plastic when shopping.",
    points: 10,
    emoji: "🛍️",
  },
  {
    title: "Shorter Shower Challenge",
    description: "Take a shower in under 5 minutes today.",
    points: 8,
    emoji: "🚿",
  },
  {
    title: "Public Transit Bonus",
    description: "Use public transportation instead of driving.",
    points: 12,
    emoji: "🚌",
  },
  {
    title: "No Meat Monday",
    description: "Eat no meat for the day to reduce your carbon footprint.",
    points: 9,
    emoji: "🥦",
  },
  {
    title: "Pick Up 5 Pieces of Trash",
    description: "Help clean your neighborhood or a local park.",
    points: 6,
    emoji: "🧹",
  },
  {
    title: "Turn Off Lights",
    description: "Keep unused lights off all day.",
    points: 7,
    emoji: "💡",
  },
  {
    title: "Refill Water Bottle",
    description: "Skip plastic bottles today.",
    points: 6,
    emoji: "🚰",
  },
  {
    title: "Recycle Something",
    description: "Recycle at least one item today.",
    points: 8,
    emoji: "♻️",
  },
  {
    title: "Use a Reusable Cup",
    description: "Use your own cup for a drink.",
    points: 7,
    emoji: "☕",
  },
  {
    title: "Walk or Bike Instead",
    description: "Walk or bike instead of driving.",
    points: 11,
    emoji: "🚴",
  },
  {
    title: "Eco Tip to a Friend",
    description: "Teach a friend one green tip today.",
    points: 5,
    emoji: "🗣️",
  },
  {
    title: "Zero Waste Meal",
    description: "Make a meal with zero packaged ingredients.",
    points: 13,
    emoji: "🥗",
  },
  {
    title: "Cold Wash Laundry",
    description: "Wash your clothes with cold water.",
    points: 6,
    emoji: "🧺",
  },
  {
    title: "Borrow Instead of Buy",
    description: "Borrow something instead of buying new.",
    points: 8,
    emoji: "🔄",
  },
  {
    title: "Digital Cleanup",
    description: "Delete unused emails/photos today.",
    points: 5,
    emoji: "💻",
  },
];

export default function SeedPage() {
  const seedChallenges = async () => {
    const challengeRef = collection(db, "challenges");
    for (const challenge of challenges) {
      await addDoc(challengeRef, challenge);
    }
    alert("✅ Challenges seeded successfully!");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <h1 className="text-2xl font-bold text-green-800 mb-6">
        🌱 EcoLocal Seeder
      </h1>
      <button
        onClick={seedChallenges}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full shadow-md transition"
      >
        Seed Challenges
      </button>
    </div>
  );
}
