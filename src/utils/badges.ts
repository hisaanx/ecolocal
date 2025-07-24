import {
  doc,
  getDoc,
  updateDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { parseISO, isSameDay, subDays } from "date-fns";

export async function checkAndAwardBadges(uid: string) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  const user = userSnap.data();
  if (!user) return;

  const earnedBadges: string[] = user.badges || [];
  const newBadges: string[] = [];

  // ✅ Completed Challenges
  const completedSnap = await getDocs(
    collection(db, "users", uid, "completedChallenges")
  );
  const completed = completedSnap.docs.map((doc) => doc.data());

  const titles = completed.map((c) => c.title?.toLowerCase() || "");

  // ✅ Dates (for streak)
  const dates = completed
    .map((c) => parseISO(c.date))
    .sort((a, b) => a.getTime() - b.getTime());

  // ✅ CO₂ Total (from challenges)
  const challengeCo2Map: Record<string, number> = {
    "no meat monday": 1.5,
    "shorter shower": 0.25,
    "recycle something": 0.5,
    "reusable bag": 0.2,
    "refill bottle": 0.1,
    "turn off lights": 0.2,
    // Include any more titles here (in lowercase)
  };
  let totalCo2 = 0;
  for (const c of completed) {
    const title = c.title?.toLowerCase() || "";
    totalCo2 += challengeCo2Map[title] || 0;
  }

  // ✅ 1. green_starter
  if (completed.length >= 1 && !earnedBadges.includes("green_starter")) {
    newBadges.push("green_starter");
  }

  // ✅ 2. carbon_saver
  if ((user.points || 0) >= 100 && !earnedBadges.includes("carbon_saver")) {
    newBadges.push("carbon_saver");
  }

  // ✅ 3. water_hero – any water-saving challenges
  const waterKeywords = ["refill", "shower"];
  const waterCount = titles.filter((t) =>
    waterKeywords.some((word) => t.includes(word))
  ).length;
  if (waterCount >= 10 && !earnedBadges.includes("water_hero")) {
    newBadges.push("water_hero");
  }

  // ✅ 4. eco_streak – 5 days in a row
  let streak = 1;
  for (let i = dates.length - 1; i > 0; i--) {
    const diff = dates[i].getTime() - dates[i - 1].getTime();
    if (diff === 86400000) {
      streak++;
    } else if (!isSameDay(dates[i], dates[i - 1])) {
      break;
    }
  }
  if (streak >= 5 && !earnedBadges.includes("eco_streak")) {
    newBadges.push("eco_streak");
  }

  // ✅ 5. local_legend – has suggested at least one eco spot
  const suggestedSnap = await getDocs(
    collection(db, "users", uid, "suggested_spots")
  );
  if (suggestedSnap.size >= 1 && !earnedBadges.includes("local_legend")) {
    newBadges.push("local_legend");
  }

  // ✅ 6. planet_hero – save 10kg+ CO2
  if (totalCo2 >= 10 && !earnedBadges.includes("planet_hero")) {
    newBadges.push("planet_hero");
  }

  // ✅ Push to Firestore
  if (newBadges.length > 0) {
    await updateDoc(userRef, {
      badges: [...earnedBadges, ...newBadges],
    });
  }

  return newBadges;
}
