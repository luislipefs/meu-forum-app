import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCG_2mjYOrdGM7uoZFct6y4TDsRUu1lGZs",
  authDomain: "meu-forum-app-firebase.firebaseapp.com",
  projectId: "meu-forum-app-firebase",
  storageBucket: "meu-forum-app-firebase.appspot.com",
  messagingSenderId: "626189175262",
  appId: "1:626189175262:android:8213b1216d1fadd401b54f"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
