import Link from "next/link";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { provider, signInWithPopup } from "@/lib/firebase";

export default function Navbar() {
  const [user] = useAuthState(auth);

return (
  <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-md px-4 py-3 rounded-b-xl">
    <div className="max-w-6xl mx-auto grid grid-cols-3 items-center">
      
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <img src="/ecolocal-logo.png" alt="Logo" className="h-8 w-8" />
        <Link href="/" className="text-xl font-bold text-green-700 hover:text-green-800 transition">
          EcoLocal
        </Link>
      </div>

      {/* Center: Navigation Links */}
      <div className="flex justify-center gap-6 text-sm font-medium text-green-800">
        <Link href="/" className="hover:text-green-600 transition duration-200">Home</Link>
        <Link href="/dashboard" className="hover:text-green-600 transition duration-200">Dashboard</Link>
        <Link href="/impact" className="hover:text-green-600 transition duration-200">Weekly Impact</Link>
        <Link href="/nearby" className="hover:text-green-600 transition duration-200">Nearby</Link>
        
      </div>

      {/* Right: User Info */}
<div className="flex justify-end items-center gap-2">
  {user ? (
    <>
      <img
        src={user?.photoURL && user.photoURL.includes("http") ? user.photoURL : "/default-avatar.png"}
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
