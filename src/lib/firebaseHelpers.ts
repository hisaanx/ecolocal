import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from './firebase';
import { subDays, format, isWithinInterval, parseISO } from 'date-fns';

export async function getCompletedChallengesForLast7Days() {
  const user = auth.currentUser;
  if (!user) return [];

  const uid = user.uid;
  const completedRef = collection(db, `users/${uid}/completedChallenges`);
  const snapshot = await getDocs(completedRef);

  console.log("🧪 All Firestore docs from completedChallenges:");
  snapshot.forEach((doc) => console.log(doc.id, doc.data()));

  const today = new Date();
  const weekAgo = subDays(today, 6);

  const results: Record<string, string[]> = {};

  snapshot.forEach((doc) => {
    const data = doc.data();
    if (!data.date || !data.title) return;

    const challengeDate = parseISO(data.date);
    const isInWeek = isWithinInterval(challengeDate, { start: weekAgo, end: today });

    if (!isInWeek) return;

    const dateStr = format(challengeDate, 'yyyy-MM-dd');

    if (!results[dateStr]) {
      results[dateStr] = [];
    }

    results[dateStr].push(data.title);
  });

  return Object.entries(results).map(([date, challenges]) => ({
    date,
    challenges,
  }));
}
