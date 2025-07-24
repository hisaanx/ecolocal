import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import StatsBars from "@/components/StatsBars";

export default function Home() {
  const [userCount, setUserCount] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [challengeCount, setChallengeCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersData = usersSnapshot.docs.map((doc) => ({
        points: doc.data().points || 0,
      }));

      setUserCount(usersSnapshot.size);
      setTotalPoints(usersData.reduce((acc, u) => acc + u.points, 0));

      const challengesSnapshot = await getDocs(collection(db, "challenges"));
      setChallengeCount(challengesSnapshot.size);
    };

    fetchStats();
  }, []);

  const fallingLeaves = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 6,
    duration: 10 + Math.random() * 5,
    opacity: 0.5 + Math.random() * 0.4,
  }));

  return (
    <>
      <main className="min-h-screen px-4 py-16 overflow-hidden relative z-10">
        {/* 🍃 Background leaves container */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {fallingLeaves.map((leaf) => (
            <motion.img
              key={leaf.id}
              src="/leaf.png"
              alt="leaf"
              className="w-6 h-6 absolute"
              style={{
                top: "-40px",
                left: `${leaf.left}%`,
                opacity: leaf.opacity,
              }}
              animate={{ y: "2500px", rotate: [0, 360] }}
              transition={{
                duration: leaf.duration,
                repeat: Infinity,
                delay: leaf.delay,
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Header */}
        <section className="text-center mb-6 relative z-10">
          <motion.img
            src="/ecolocal-logo.png"
            alt="EcoLocal Logo"
            className="mx-auto h-32 md:h-48 object-contain drop-shadow-2xl"
            whileHover={{ scale: 1.05, rotate: 1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.p
            className="text-2xl md:text-3xl font-quicksand font-semibold bg-gradient-to-r from-green-500 to-blue-500 text-transparent bg-clip-text drop-shadow-md mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Empowering citizens to live more sustainably — one challenge at a
            time.
          </motion.p>
        </section>

        {/* What We Do / Why It Matters */}
        <section className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12 z-10 relative">
          <div className="bg-white/80 backdrop-blur-md border-l-4 border-green-500 shadow-lg rounded-xl p-6 hover:scale-[1.01] hover:shadow-xl transition">
            <h2 className="text-xl font-bold text-green-700 mb-2">
              💡 What We Do
            </h2>
            <p className="text-gray-700">
              EcoLocal helps you build eco-friendly habits with daily
              challenges, a point system, and local community tips — all
              tailored to make your city more sustainable.
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-md border-l-4 border-yellow-500 shadow-lg rounded-xl p-6 hover:scale-[1.01] hover:shadow-xl transition">
            <h2 className="text-xl font-bold text-yellow-700 mb-2">
              🌍 Why It Matters
            </h2>
            <p className="text-gray-700">
              Cities are responsible for 70%+ of carbon emissions. Your small
              actions add up — helping achieve <strong>UN Goal 11</strong>:
              sustainable cities.
            </p>
          </div>
        </section>

        {/* Stats Summary */}
        <section className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 text-center mb-12 relative z-10">
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border-t-4 border-blue-400 shadow-md hover:scale-[1.02] hover:shadow-xl transition">
            <h3 className="text-3xl font-bold text-blue-700">{userCount}</h3>
            <p className="text-gray-600 mt-1">Users Participating</p>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border-t-4 border-green-400 shadow-md hover:scale-[1.02] hover:shadow-xl transition">
            <h3 className="text-3xl font-bold text-green-700">
              {challengeCount}
            </h3>
            <p className="text-gray-600 mt-1">Challenges Available</p>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border-t-4 border-amber-400 shadow-md hover:scale-[1.02] hover:shadow-xl transition">
            <h3 className="text-3xl font-bold text-amber-700">{totalPoints}</h3>
            <p className="text-gray-600 mt-1">Total Points Earned</p>
          </div>
        </section>

        {/* Progress Bars */}
        <section className="max-w-4xl mx-auto mt-16 relative z-10">
          <StatsBars />
        </section>

        {/* UN Goal Info Section */}
        <section className="max-w-7xl mx-auto mt-20 bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg relative z-10">
          <motion.h2
            className="text-2xl font-bold text-green-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            🌍 Learn More About UN Goal 11: Sustainable Cities
          </motion.h2>

          <motion.div
            className="space-y-4 text-gray-700 leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <p>
              UN Sustainable Development Goal 11 is all about making cities
              inclusive, safe, resilient, and sustainable. As more people move
              to urban areas, the impact of how we build and live becomes even
              more critical.
            </p>

            <ul className="list-disc list-inside space-y-2">
              <li>
                🌐 <strong>Over 4 billion people</strong> live in cities — more
                than half the world’s population.
              </li>
              <li>
                🏙️ Cities contribute to{" "}
                <strong>~70% of global CO₂ emissions</strong>.
              </li>
              <li>
                🚲 <em>Small changes</em> (like biking or recycling) make a{" "}
                <em>big collective impact</em>.
              </li>
              <li>
                ♻️ <strong>EcoLocal</strong> helps <em>empower</em> everyday
                citizens to take action right where they live.
              </li>
            </ul>

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <div className="bg-green-100 rounded-lg p-4 shadow-inner">
                <h3 className="font-semibold text-green-700 mb-2">
                  The Big Picture
                </h3>
                <p className="text-sm">
                  By 2030, almost 60% of the world’s population will live in
                  urban areas. Sustainable city design is key to fighting
                  climate change.
                </p>
              </div>
              <div className="bg-yellow-100 rounded-lg p-4 shadow-inner">
                <h3 className="font-semibold text-yellow-700 mb-2">
                  How You Help
                </h3>
                <p className="text-sm">
                  Every challenge you complete on EcoLocal — biking, reusing,
                  saving energy — helps shape a smarter, greener future.
                </p>
              </div>
            </div>

            <img
              src="/sdg11.png"
              alt="UN Goal 11 Icon"
              className="w-32 mx-auto mt-6"
            />
          </motion.div>
        </section>
      </main>
    </>
  );
}
