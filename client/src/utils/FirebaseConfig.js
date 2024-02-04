import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBUNYhqfFOa1Q8Q24KClIaP0qGSTnWBxSU",
  authDomain: "whatsapp-f8740.firebaseapp.com",
  projectId: "whatsapp-f8740",
  storageBucket: "whatsapp-f8740.appspot.com",
  messagingSenderId: "656385655054",
  appId: "1:656385655054:web:2f5783e5183df375b8575f",
  measurementId: "G-7LRQBK4KBM"
};


const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);