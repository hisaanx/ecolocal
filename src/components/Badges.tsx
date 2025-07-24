import { useState } from "react";

type BadgesProps = {
  badges: string[]; // IDs of unlocked badges
};

const ALL_BADGES = [
  {
    id: "green_starter",
    name: "Green Starter",
    description: "Complete your very first challenge",
    emoji: "🌱",
  },
  {
    id: "carbon_saver",
    name: "Carbon Saver",
    description: "Earn 100 points total",
    emoji: "🌿",
  },
  {
    id: "water_hero",
    name: "Water Hero",
    description: "Complete 10 water-saving challenges",
    emoji: "💧",
  },
  {
    id: "eco_streak",
    name: "Eco Streak",
    description: "Complete challenges 5 days in a row",
    emoji: "🔥",
  },
  {
    id: "local_legend",
    name: "Local Legend",
    description: "Suggest 3 eco-spots",
    emoji: "📍",
  },
  {
    id: "planet_hero",
    name: "Planet Hero",
    description: "Save 10 kg of CO₂ total",
    emoji: "🌍",
  },
];

export default function Badges({ badges }: BadgesProps) {
  return (
    <div className="my-10">
      <h3 className="text-xl font-semibold text-green-800 mb-8 flex items-center gap-2">
        🏅 Your Badges
      </h3>

      <div className="flex flex-wrap gap-4 justify-center md:justify-start">
        {ALL_BADGES.map((badge) => {
          const isUnlocked = badges.includes(badge.id);

          return (
            <div key={badge.id} className="relative group">
              {/* Tooltip */}
              <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-50 hidden group-hover:block">
                <div className="bg-white text-gray-800 border border-gray-300 px-4 py-2 rounded-md shadow-xl text-sm w-48 text-center">
                  <div className="font-bold">{badge.name}</div>
                  <div className="text-xs mt-1">{badge.description}</div>
                </div>
              </div>

              {/* Badge */}
              <div
                className={`w-28 h-20 min-w-[7rem] flex flex-col items-center justify-center rounded-xl border shadow-md transition ${
                  isUnlocked
                    ? "bg-white text-gray-800"
                    : "bg-gray-100 text-gray-400 opacity-60"
                }`}
              >
                <div className="text-2xl mb-1">{badge.emoji}</div>
                <div className="text-sm font-medium text-center">
                  {badge.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
