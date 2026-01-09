import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAuNpHIvnn3Hyuq4ra9MRlzirO1aBcahqY",
  authDomain: "clasnia-c1291.firebaseapp.com",
  projectId: "clasnia-c1291",
  storageBucket: "clasnia-c1291.firebasestorage.app",
  messagingSenderId: "1058027719626",
  appId: "1:1058027719626:web:0ea21ab0ebdbba4c109d33",
  measurementId: "G-HT5LB5EGNQ"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { app, auth, db };
