import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFOHELvgSbTRojY7kPigbW6sO7UxE9vOo",
  authDomain: "inventory-management-674eb.firebaseapp.com",
  projectId: "inventory-management-674eb",
  storageBucket: "inventory-management-674eb.firebasestorage.app",
  messagingSenderId: "289861779325",
  appId: "1:289861779325:web:bf4a9d5f33992b14671614"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth;