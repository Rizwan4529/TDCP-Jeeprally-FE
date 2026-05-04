import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDmQlc3mFJmQcWwEHpqoNFD5ugl-tJ0vno",
  authDomain: "tdcp-e4d8a.firebaseapp.com",
  projectId: "tdcp-e4d8a",
  storageBucket: "tdcp-e4d8a.firebasestorage.app",
  messagingSenderId: "733344221877",
  appId: "1:733344221877:web:f8f05b51e4bd2921e8ccfc",
  measurementId: "G-DHGPWS8CB8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);