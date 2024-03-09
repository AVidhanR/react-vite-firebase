import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBWyFraUeok47PhZmV-UsOwlfLb_NCzjD4",
  authDomain: "example-6a7e0.firebaseapp.com",
  projectId: "example-6a7e0",
  storageBucket: "example-6a7e0.appspot.com",
  messagingSenderId: "338847254252",
  appId: "1:338847254252:web:3f224c62aac978ad3647c9",
  measurementId: "G-60PLRKMRWF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
export const storage = getStorage(app);
