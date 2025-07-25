import Link from "next/link";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { provider, signInWithPopup } from "@/lib/firebase";

export default function Navbar() {
  const [user] = useAuthState(auth);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-md px-4 py-3">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center sm:justify-between gap-2 sm:gap-0">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/ecolocal-logo.png" alt="Logo" className="h-8 w-8" />
          <Link
            href="/"
            className="text-xl font-bold text-green-700 hover:text-green-800"
          >
            EcoLocal
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-green-800 mt-2 sm:mt-0">
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

        {/* User Info */}
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
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
                className="text-red-500 hover:underline text-sm"
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
