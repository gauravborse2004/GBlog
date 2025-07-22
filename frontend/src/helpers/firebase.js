import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "gblog-9cbf3.firebaseapp.com",
  projectId: "gblog-9cbf3",
  storageBucket: "gblog-9cbf3.firebasestorage.app",
  messagingSenderId: "584381226103",
  appId: "1:584381226103:web:ce610bad0a6cd833473a72"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const provider = new GoogleAuthProvider()

// Force account selection every time
provider.setCustomParameters({
  prompt: "select_account"
})

export { auth, provider }