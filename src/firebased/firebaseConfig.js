// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAMET-_Nqn0sj4tp0_0yfZEjDZ8-wzwUj8",
//   authDomain: "institute2-a881e.firebaseapp.com",
//   projectId: "institute2-a881e",
//   storageBucket: "institute2-a881e.appspot.com",
//   messagingSenderId: "283540731780",
//   appId: "1:283540731780:web:9d4e543d2b954176984fd1",
//   measurementId: "G-X2ZTYK3RXB"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

import { initializeApp } from "firebase/app";
import {getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMET-_Nqn0sj4tp0_0yfZEjDZ8-wzwUj8",
  authDomain: "institute2-a881e.firebaseapp.com",
  projectId: "institute2-a881e",
  storageBucket: "institute2-a881e.appspot.com",
  messagingSenderId: "283540731780",
  appId: "1:283540731780:web:9d4e543d2b954176984fd1",
  measurementId: "G-X2ZTYK3RXB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export {db, collection, addDoc, getDocs, doc, updateDoc, deleteDoc  };


