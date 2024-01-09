import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, child, get, set, update, remove, onValue, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

  const firebaseConfig = {
    apiKey: "AIzaSyDTP4EhGGwAEHy-M_-9OV876YGMlgggvmE",
    authDomain: "clean-e-commerce.firebaseapp.com",
    databaseURL: "https://clean-e-commerce-default-rtdb.firebaseio.com",
    projectId: "clean-e-commerce",
    storageBucket: "clean-e-commerce.appspot.com",
    messagingSenderId: "661240779800",
    appId: "1:661240779800:web:8ae157f2f081a780759f6d"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase();
