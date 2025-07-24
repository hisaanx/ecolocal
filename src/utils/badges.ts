import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function checkAndAwardBadges(uid: string) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  const user = userSnap.data();

  if (!user) return;

  const earnedBadges: string[] = user.badges || [];
  const newBadges: string[] = [];

  const completions: string[] = user.completedChallenges || [];

  // ♻️ Recycling Hero
  const recycleCount = completions.filter((c) =>
    c.toLowerCase().includes("recycle")
  ).length;
  if (recycleCount >= 3 && !earnedBadges.includes("Recycling Hero")) {
    newBadges.push("Recycling Hero");
  }

  // 🔥 Carbon Saver
  if (user.points >= 50 && !earnedBadges.includes("Carbon Saver")) {
    newBadges.push("Carbon Saver");
  }

  // 🌱 Eco Explorer
  if (completions.length >= 5 && !earnedBadges.includes("Eco Explorer")) {
    newBadges.push("Eco Explorer");
  }

  if (newBadges.length > 0) {
    await updateDoc(userRef, {
      badges: [...earnedBadges, ...newBadges],
    });
  }

  return newBadges;
}
