import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB8uyK89fl2C6BlG7FuZFoU-IczqtKjupY",
  authDomain: "ecolocal-c480f.firebaseapp.com",
  projectId: "ecolocal-c480f",
  storageBucket: "ecolocal-c480f.firebasestorage.app",
  messagingSenderId: "854018818201",
  appId: "1:854018818201:web:596b079abe566f79323808"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
export { db, auth, app, provider, signInWithPopup };

