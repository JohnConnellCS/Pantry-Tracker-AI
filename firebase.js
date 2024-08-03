// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCM3C0iqRoXLMcV0kIr3vpez8fN3tra388",
  authDomain: "inventory-management-app-bbcac.firebaseapp.com",
  projectId: "inventory-management-app-bbcac",
  storageBucket: "inventory-management-app-bbcac.appspot.com",
  messagingSenderId: "823295447423",
  appId: "1:823295447423:web:860f76d7e5dc6793798a4a",
  measurementId: "G-HKFN0SCLGP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export { firestore };
