// src/components/AuthButtons.tsx
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

export default function AuthButtons() {
  const [user] = useAuthState(auth);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="text-sm text-white">
      {user ? (
        <div className="flex items-center gap-2">
          <span>Hi, {user.displayName?.split(" ")[0]}</span>
          <button onClick={handleLogout} className="text-red-300 underline">Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin} className="text-green-300 underline">Login with Google</button>
      )}
    </div>
  );
}
