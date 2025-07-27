import Link from "next/link";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { provider, signInWithPopup } from "@/lib/firebase";
import { useState } from "react";

export default function Navbar() {
  const [user] = useAuthState(auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-md px-4 py-3 rounded-b-xl">
      <div className="max-w-6xl mx-auto grid grid-cols-3 items-center">
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

        {/* Center: Desktop Navigation Links - Hidden on mobile */}
        <div className="hidden md:flex justify-center gap-6 text-sm font-medium text-green-800">
          <Link
            href="/"
            className="hover:text-green-600 transition duration-200"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="hover:text-green-600 transition duration-200"
          >
            Dashboard
          </Link>
          <Link
            href="/impact"
            className="hover:text-green-600 transition duration-200"
          >
            Weekly Impact
          </Link>
          <Link
            href="/nearby"
            className="hover:text-green-600 transition duration-200"
          >
            Nearby
          </Link>
        </div>

        {/* Right: User Info + Mobile Menu Button */}
        <div className="flex items-center justify-end w-full">
          {/* Mobile menu button - Only visible on mobile, positioned more to the left */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-green-700 hover:bg-green-50 rounded-md transition mr-4"
            aria-label="Toggle menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* User info - positioned at the far right */}
          {user ? (
            <div className="flex items-center gap-2">
              <img
                src={
                  user?.photoURL && user.photoURL.includes("http")
                    ? user.photoURL
                    : "/default-avatar.png"
                }
                alt="avatar"
                className="w-8 h-8 rounded-full border border-green-400 object-cover"
              />
              <span className="text-green-800 font-semibold hidden sm:inline text-sm">
                Hi, {user.displayName?.split(" ")[0] || "User"}
              </span>
              <button
                onClick={() => signOut(auth)}
                className="text-red-500 hover:underline text-sm"
              >
                Logout
              </button>
            </div>
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

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pb-3 border-t border-green-200">
          <div className="flex flex-col space-y-2 px-4 pt-3">
            <Link
              href="/"
              className="text-green-800 hover:text-green-600 py-2 transition duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="text-green-800 hover:text-green-600 py-2 transition duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/impact"
              className="text-green-800 hover:text-green-600 py-2 transition duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Weekly Impact
            </Link>
            <Link
              href="/nearby"
              className="text-green-800 hover:text-green-600 py-2 transition duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Nearby
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
