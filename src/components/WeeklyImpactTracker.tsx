'use client';

import { useEffect, useState } from 'react';
import { getCompletedChallengesForLast7Days } from '@/lib/firebaseHelpers';
import { IMPACT_VALUES } from '@/lib/impactStats';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';

export default function WeeklyImpactTracker() {
  const [user, loading] = useAuthState(auth);
  const [completedDays, setCompletedDays] = useState(0);
  const [co2Saved, setCo2Saved] = useState(0);
  const [waterSaved, setWaterSaved] = useState(0);

  useEffect(() => {
    if (!user || loading) return;

    const fetchData = async () => {
      const weekData = await getCompletedChallengesForLast7Days();

      console.log("📅 Raw weekData from Firestore:", weekData);

      let days = 0;
      let totalCO2 = 0;
      let totalWater = 0;

      for (const entry of weekData) {
        console.log(`➡️ ${entry.date}:`, entry.challenges);

        if (entry.challenges.length > 0) days++;

        for (const challengeTitle of entry.challenges) {
          const impact = IMPACT_VALUES[challengeTitle];
          if (impact) {
            totalCO2 += impact.co2;
            totalWater += impact.water;
          } else {
            console.warn(`⚠️ No impact data for: "${challengeTitle}"`);
          }
        }
      }

      console.log("✅ Final Counts:", { days, totalCO2, totalWater });

      setCompletedDays(days);
      setCo2Saved(totalCO2);
      setWaterSaved(totalWater);
    };

    fetchData();
  }, [user, loading]);


  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-green-200 mb-6">
      <h2 className="text-2xl font-extrabold mb-2 flex items-center gap-2">
        <span>💚</span>
        <span className="bg-gradient-to-r from-green-600 to-blue-500 text-transparent bg-clip-text">
          Weekly Impact Tracker
        </span>
      </h2>

      <p className="mb-2 text-gray-800">
        You've completed <span className="font-semibold text-green-700">{completedDays}</span> of 7 days this week!
      </p>

      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div
          className="bg-green-500 h-3 rounded-full transition-all duration-300"
          style={{ width: `${(completedDays / 7) * 100}%` }}
        />
      </div>

      <p className="text-base text-gray-800">
        🌱 CO₂ Saved: <strong>{co2Saved.toFixed(2)} kg</strong>
      </p>
      <p className="text-base text-gray-800">
        💧 Water Saved: <strong>{waterSaved.toFixed(0)} liters</strong>
      </p>
    </div>
  );
}
