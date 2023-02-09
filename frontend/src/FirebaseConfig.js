// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCOM9I270O3ZvPPfUVqgZ7X4HGzIhYlqfo",
  authDomain: "break-book-club.firebaseapp.com",
  projectId: "break-book-club",
  storageBucket: "break-book-club.appspot.com",
  messagingSenderId: "548423212000",
  appId: "1:548423212000:web:05a8ffb941a886523b6985",
  measurementId: "G-WYL9MPZSRS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };