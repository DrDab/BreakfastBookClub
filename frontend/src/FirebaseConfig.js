// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import {
    getFirestore,
    collection,
    addDoc,
} from "firebase/firestore"

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
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// New user
const register = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      email,
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

// User is already registered
const logIn = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

// Logout
const logout = () => {
  signOut(auth);
};

export {
    auth,
    db,
    register,
    logIn,
    logout,
};