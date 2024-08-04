// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAStyPLRuiPOMi3mz_sNY1aylIVRidnLcY",
  authDomain: "inven-track-99195.firebaseapp.com",
  projectId: "inven-track-99195",
  storageBucket: "inven-track-99195.appspot.com",
  messagingSenderId: "549358519187",
  appId: "1:549358519187:web:0d590ce65ea93bf8abde66"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };