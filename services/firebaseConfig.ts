// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCT62Y3fnjtyB5ZdmNK7d0KnvsomyzeWVk",
  authDomain: "calculadoravoltaic.firebaseapp.com",
  projectId: "calculadoravoltaic",
  storageBucket: "calculadoravoltaic.firebasestorage.app",
  messagingSenderId: "28846522699",
  appId: "1:28846522699:web:48a7e2674a73af00e068ce"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;

