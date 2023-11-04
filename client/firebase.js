// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth' 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDs_mreve65QjPSq7xVliEV66iGx7QsYj4",
  authDomain: "grampohone.firebaseapp.com",
  projectId: "grampohone",
  storageBucket: "grampohone.appspot.com",
  messagingSenderId: "1062948285271",
  appId: "1:1062948285271:web:c1c3b03ecf52d29edc2c12",
  measurementId: "G-3RPJ77DT0Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const user_auth = getAuth(app)
const google_provider = new GoogleAuthProvider()
export {app , user_auth, google_provider};