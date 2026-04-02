import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

 const firebaseConfig = {
    apiKey: "AIzaSyB_HW8hJlncfvHB6uOVk9y9rm_T_LeEjHQ",
    authDomain: "dhruva-ai-resume-builder-2.firebaseapp.com",
    databaseURL: "https://dhruva-ai-resume-builder-2-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "dhruva-ai-resume-builder-2",
    storageBucket: "dhruva-ai-resume-builder-2.firebasestorage.app",
    messagingSenderId: "1062194210132",
    appId: "1:1062194210132:web:b85e38b247cafb6a8ed4c1",
    measurementId: "G-QE919LPXK6"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};
