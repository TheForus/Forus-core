// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDnwvB8HNuEWyKYXOjsoWuQBXRHROCwZXY",
  authDomain: "cryptia-9be0a.firebaseapp.com",
  projectId: "cryptia-9be0a",
  storageBucket: "cryptia-9be0a.appspot.com",
  messagingSenderId: "681254250248",
  appId: "1:681254250248:web:4ded79603e742d487feebd",
  measurementId: "G-SLWVRZK723"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db= getFirestore(app)