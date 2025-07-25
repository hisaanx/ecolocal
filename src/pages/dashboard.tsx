import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuthState } from "react-firebase-hooks/auth";
import { parseISO, format, subDays, isSameDay } from "date-fns";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import Leaderboard from "@/components/Leaderboard";
import Badges from "@/components/Badges";
import { checkAndAwardBadges } from "@/utils/badges";
import { launchConfetti } from "@/hooks/useConfetti";
import toast from "react-hot-toast";

type Challenge = {
  id: string;
  title: string;
  description: string;
  points: number;
  emoji?: string;
};

export default function Dashboard() {
  const [user] = useAuthState(auth);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [lockedSlots, setLockedSlots] = useState<number[]>([]);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [completedCountToday, setCompletedCountToday] = useState(0);

  const today = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          points: 0,
          completedChallenges: [],
          badges: [],
          displayName: user.displayName || "Anonymous",
          photoURL: user.photoURL || "/default-avatar.png",
          streakCount: 0,
          lastCompletedDate: "",
        });
      }

      const userData = userSnap.data()!;
      setPoints(userData.points || 0);
      setBadges(userData.badges || []);
      setStreak(userData.streakCount || 0);

      // Load today’s assigned challenges if they exist
      const assignedRef = doc(db, "users", user.uid, "daily", today);
      const assignedSnap = await getDoc(assignedRef);

      let todayChallenges: Challenge[] = [];

      if (assignedSnap.exists()) {
        // Already assigned today
        const assignedIds = assignedSnap.data().challengeIds || [];
        const all = await getDocs(collection(db, "challenges"));
        const challengeMap = Object.fromEntries(
          all.docs.map((d) => [d.id, { id: d.id, ...d.data() }])
        );
        todayChallenges = assignedIds
          .map((id: string) => challengeMap[id])
          .filter((c: any) => c) as Challenge[];
      } else {
        // Assign 3 fresh ones
        const snapshot = await getDocs(collection(db, "challenges"));
        const all = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Challenge[];
        const shuffled = all.sort(() => 0.5 - Math.random());
        todayChallenges = shuffled.slice(0, 3);

        await setDoc(assignedRef, {
          challengeIds: todayChallenges.map((c) => c.id),
        });
      }

      setChallenges(todayChallenges);

      // Fetch completed
      const completedSnapshot = await getDocs(
        collection(db, "users", user.uid, "completedChallenges")
      );

      const locked: number[] = [];
      let count = 0;

      completedSnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.date === today) {
          const matchedIndex = todayChallenges.findIndex(
            (c) => c.id === data.challengeId
          );
          if (matchedIndex !== -1) {
            locked.push(matchedIndex);
            count++;
          }
        }
      });

      setCompletedCountToday(count);
      setLockedSlots(count >= 3 ? [0, 1, 2] : locked);
    };

    fetchDashboardData();
  }, [user]);

  const handleComplete = async (challenge: Challenge) => {
    if (!user) return alert("Please log in first.");
    if (lockedSlots.length >= 3)
      return alert("✅ You've already completed 3 challenges today!");

    const challengeRef = doc(
      db,
      "users",
      user.uid,
      "completedChallenges",
      `${today}-${challenge.id}`
    );
    const alreadyDone = await getDoc(challengeRef);
    if (alreadyDone.exists()) return alert("You've already done this!");

    await setDoc(challengeRef, {
      challengeId: challenge.id,
      date: today,
      title: challenge.title,
      points: challenge.points,
    });

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data() || {};

    // Streak logic
    let newStreak = 1;
    if (userData.lastCompletedDate) {
      const last = parseISO(userData.lastCompletedDate);
      const yesterday = subDays(new Date(), 1);
      if (isSameDay(last, new Date())) {
        newStreak = userData.streakCount || 1;
      } else if (isSameDay(last, yesterday)) {
        newStreak = (userData.streakCount || 1) + 1;
      }
    }

    await updateDoc(userRef, {
      points: increment(challenge.points),
      lastCompletedDate: today,
      streakCount: newStreak,
    });

    setPoints((prev) => prev + challenge.points);
    setStreak(newStreak);
    const index = challenges.findIndex((c) => c.id === challenge.id);
    setLockedSlots((prev) => [...prev, index]);
    setCompletedCountToday((prev) => prev + 1);
    launchConfetti();

    const newBadges = await checkAndAwardBadges(user.uid);
    if (newBadges?.length) {
      toast(`🏅 New badge unlocked: ${newBadges.join(", ")}`, {
        icon: "🏆",
        duration: 5000,
        style: {
          borderRadius: "12px",
          background: "#fefce8",
          color: "#444",
          fontWeight: "600",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        },
      });
    }

    toast.success(`✅ Completed! You earned ${challenge.points} points!`, {
      icon: "🎉",
      duration: 4000,
      style: {
        borderRadius: "12px",
        background: "#ffffff",
        color: "#222",
        fontWeight: "bold",
        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
      },
    });

    if (lockedSlots.length + 1 === 3) {
      toast.success("🏆 You've completed all 3 challenges today! Way to go!", {
        icon: "🌟",
        duration: 5000,
        style: {
          borderRadius: "12px",
          background: "#d1fae5",
          color: "#065f46",
          fontWeight: "bold",
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
        },
      });

      launchConfetti();
    }
  };

  const handleRefresh = async () => {
    if (lockedSlots.length >= 3) return;

    const snapshot = await getDocs(collection(db, "challenges"));
    const all = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Challenge[];

    const shuffled = all.sort(() => 0.5 - Math.random());

    const newChallenges = [...challenges];
    let shuffledIndex = 0;

    for (let i = 0; i < 3; i++) {
      if (!lockedSlots.includes(i)) {
        // Find next unused challenge
        while (
          shuffledIndex < shuffled.length &&
          challenges.find((c) => c.id === shuffled[shuffledIndex].id)
        ) {
          shuffledIndex++;
        }
        if (shuffledIndex < shuffled.length) {
          newChallenges[i] = shuffled[shuffledIndex];
          shuffledIndex++;
        }
      }
    }

    setChallenges(newChallenges);
    // Update Firestore stored challenge set
    if (user) {
      const assignedRef = doc(db, "users", user.uid, "daily", today);
      await setDoc(assignedRef, {
        challengeIds: newChallenges.map((c) => c.id),
      });
    }
  };

  return (
    <main className="min-h-screen px-4 pb-10 bg-transparent">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-green-800 mb-4">
          Today's Eco Challenges
        </h1>

        <div className="mb-4 text-green-700 font-semibold">
          🌿 Total Points: {points}
        </div>

        <div className="mb-6 bg-white/80 backdrop-blur-md border-l-4 border-yellow-400 p-4 rounded-xl shadow-md">
          <h3 className="text-yellow-700 font-semibold text-lg">
            🔥 Current Streak
          </h3>
          <p className="text-gray-700">
            {streak > 0
              ? `You've completed challenges for ${streak} day${
                  streak !== 1 ? "s" : ""
                } in a row!`
              : "Start a challenge to begin your streak!"}
          </p>
          {streak > 0 && streak % 3 === 0 && (
            <p className="text-sm text-green-600 mt-1">
              🎁 Bonus incoming! {streak}-day streak milestone!
            </p>
          )}
        </div>

        <Badges badges={badges} />

        {/* Refresh Button */}
        <div className="bg-white/80 backdrop-blur-md border border-blue-200 rounded-lg p-4 mb-6 shadow-sm">
          <h3 className="text-blue-700 font-semibold mb-1 text-sm">
            🔄 Not feeling these? Reroll any uncompleted ones!
          </h3>
          <button
            onClick={handleRefresh}
            className={`mt-1 px-4 py-1 rounded text-white text-sm ${
              lockedSlots.length >= 3
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={lockedSlots.length >= 3}
          >
            Refresh Challenges
          </button>
        </div>

        {/* Challenge List */}
        {challenges.map((challenge, i) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white/80 backdrop-blur-md rounded-xl shadow-md p-5 mb-5 border-l-4 border-green-500 transition hover:scale-[1.01] hover:shadow-lg"
          >
            <h2 className="text-lg font-semibold text-green-700">
              {challenge.emoji || "🌿"} {challenge.title}
            </h2>
            <p className="text-gray-700">{challenge.description}</p>
            <p className="mt-1 text-sm font-bold text-green-600">
              {challenge.points} points
            </p>
            <button
              disabled={lockedSlots.includes(i)}
              onClick={() => handleComplete(challenge)}
              className={`mt-3 px-4 py-1 rounded ${
                lockedSlots.includes(i)
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {lockedSlots.includes(i) ? "Completed" : "Mark as Done"}
            </button>
          </motion.div>
        ))}

        <Leaderboard />

        <div className="text-center text-sm text-gray-500 mt-10">
          🌱 Keep it green with EcoLocal
        </div>
      </div>
    </main>
  );
}
