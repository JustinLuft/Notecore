// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";       // for login
import { getFirestore } from "firebase/firestore"; // for notes storage

const firebaseConfig = {
  apiKey: "AIzaSyCYo72u7MJoohSvSTBTb1_yFdWtopeyLjo",
  authDomain: "notecore-37f42.firebaseapp.com",
  projectId: "notecore-37f42",
  storageBucket: "notecore-37f42.firebasestorage.app",
  messagingSenderId: "78358326779",
  appId: "1:78358326779:web:27b990a971cc0a2861ef5e"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export auth and firestore so you can use them in pages/components
export const auth = getAuth(app);
export const db = getFirestore(app);

// ✅ Add this line:
export { app };
