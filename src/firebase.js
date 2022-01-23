import { initializeApp } from "firebase/app"
//import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage" 
import { getFirestore } from "firebase/firestore"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyAgZRZqZVF7xJ6mGtIvK7SATAW_90JwlWc",
    authDomain: "avilo-tictac.firebaseapp.com",
    projectId: "avilo-tictac",
    storageBucket: "avilo-tictac.appspot.com",
    messagingSenderId: "709811121185",
    appId: "1:709811121185:web:7ebd8b5b12cba4645b8760"
  };

  const app = initializeApp(firebaseConfig)
  export const storage = getStorage(app)
  export const db = getFirestore();
  export const auth = getAuth(app)
  export const provider = new GoogleAuthProvider()
  export default app