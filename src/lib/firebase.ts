import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDr0zlHDuae7ILp6ekrUgZPHa_TFqb5Wbc",
  authDomain: "controle-de-carteira.firebaseapp.com",
  databaseURL: "https://controle-de-carteira-default-rtdb.firebaseio.com",
  projectId: "controle-de-carteira",
  storageBucket: "controle-de-carteira.firebasestorage.app",
  messagingSenderId: "138372052472",
  appId: "1:138372052472:web:98f4dcc41d6f061f61120d",
  measurementId: "G-G7HM7S79KS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth for general use
export const db = getFirestore(app);
export const auth = getAuth(app);

// Initialize Analytics conditionally (it only works in browser environments)
export const analytics = typeof window !== "undefined" ? isSupported().then(yes => yes ? getAnalytics(app) : null) : null;

export default app;
