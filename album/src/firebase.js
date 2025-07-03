// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 

// ✅ Paste your config here ↓
const firebaseConfig = {
  apiKey: "AIzaSyCOsmxhc_huHH_mff3h3dfilM-ebU_SiyE",
  authDomain: "basicapp-97e7d.firebaseapp.com",
  projectId: "basicapp-97e7d",
  storageBucket: "basicapp-97e7d.firebasestorage.app",
  messagingSenderId: "472981459763",
  appId: "1:472981459763:web:1cf2576f81873705d26446"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);