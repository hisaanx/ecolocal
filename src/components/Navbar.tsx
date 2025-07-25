import Link from "next/link";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { provider, signInWithPopup } from "@/lib/firebase";

export default function Navbar() {
  const [user] = useAuthState(auth);

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-md px-4 py-3 w-full z-40">
      <div className="max-w-6xl mx-auto relative flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <img src="/ecolocal-logo.png" alt="Logo" className="h-8 w-8" />
          <Link
            href="/"
            className="text-xl font-bold text-green-700 hover:text-green-800 transition"
          >
            EcoLocal
          </Link>
        </div>

        {/* Center: Navigation Links (absolutely centered on desktop) */}
        <div className="absolute left-1/2 transform -translate-x-1/2 hidden sm:flex gap-6 text-sm font-medium text-green-800">
          <Link href="/" className="hover:text-green-600 transition">
            Home
          </Link>
          <Link href="/dashboard" className="hover:text-green-600 transition">
            Dashboard
          </Link>
          <Link href="/impact" className="hover:text-green-600 transition">
            Weekly Impact
          </Link>
          <Link href="/nearby" className="hover:text-green-600 transition">
            Nearby
          </Link>
        </div>

        {/* Right: User Info */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <img
                src={
                  user?.photoURL?.includes("http")
                    ? user.photoURL
                    : "/default-avatar.png"
                }
                alt="avatar"
                className="w-8 h-8 rounded-full border border-green-400 object-cover"
              />
              <span className="text-green-800 font-semibold hidden sm:inline">
                Hi, {user.displayName?.split(" ")[0] || "User"}
              </span>
              <button
                onClick={() => signOut(auth)}
                className="text-red-500 hover:underline ml-2 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => signInWithPopup(auth, provider)}
              className="text-green-700 hover:underline text-sm font-semibold"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
