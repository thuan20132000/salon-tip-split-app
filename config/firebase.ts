// config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { FirebaseConfig } from '../types/firebase';

const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyB7HRwhsjk7ST9RpJT8wDs7NJWa2LY-wfY",
  authDomain: "salon-tip-split.firebaseapp.com",
  projectId: "salon-tip-split",
  storageBucket: "salon-tip-split.firebasestorage.app",
  messagingSenderId: "528710002343",
  appId: "1:528710002343:web:03770be83cff78308f1d82",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);



// Initialize Firestore
const db = getFirestore(app);

export { db };