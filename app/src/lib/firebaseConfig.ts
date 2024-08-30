// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpfvgQltFGrgrhYjEx1VX8hSvbTv3L1-c",
  authDomain: "fit2101-84296.firebaseapp.com",
  projectId: "fit2101-84296",
  storageBucket: "fit2101-84296.appspot.com",
  messagingSenderId: "930229752808",
  appId: "1:930229752808:web:436efbf5cde07056e04a5d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
