import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";

interface User {
  displayName: string;
  photoURL: string;
  points: number;
}

export default function Leaderboard() {
  const [topUsers, setTopUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchLeaderboard() {
      const q = query(collection(db, "users"), orderBy("points", "desc"), limit(10));
      const querySnapshot = await getDocs(q);
      const usersData: User[] = [];

      querySnapshot.forEach((doc) => {
        usersData.push(doc.data() as User);
      });

      setTopUsers(usersData);
    }

    fetchLeaderboard();
  }, []);

return (
  <div className="mt-8 p-4 bg-white rounded-xl shadow-md border border-gray-200">
    <h2 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
      🏆 Leaderboard
    </h2>
    <ul className="space-y-3">
      {topUsers.map((user, index) => (
        <li
          key={index}
          className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-md hover:bg-green-50 transition"
        >
          <div className="flex items-center gap-3">
            <span className="font-bold text-gray-700">{index + 1}.</span>
            <img
              src={user.photoURL || "/default-avatar.png"}
              alt={user.displayName || "User"}
              className="w-8 h-8 rounded-full border border-gray-300 object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/default-avatar.png";
                }}
            />
            <span className="text-gray-800 font-medium">{user.displayName}</span>
          </div>
          <span className="font-semibold text-green-700">{user.points} pts</span>
        </li>
      ))}
    </ul>
  </div>
);

}
