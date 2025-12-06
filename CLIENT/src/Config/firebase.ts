import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBR3n_EaWXmY7HIcXxqhXHeGwMJH8J5dOA",
    authDomain: "jet-mailer.firebaseapp.com",
    projectId: "jet-mailer",
    storageBucket: "jet-mailer.firebasestorage.app",
    messagingSenderId: "490993912475",
    appId: "1:490993912475:web:de9cecc85bd60de73d143e",
    measurementId: "G-4NZETJSRBP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };