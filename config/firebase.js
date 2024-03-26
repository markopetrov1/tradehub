import { initializeApp } from "firebase/app";

import { collection, getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyD3u8OfTeuwpPFYRNp4Bdy2y1itQn21y-I",
  authDomain: "tradehub-a76c5.firebaseapp.com",
  projectId: "tradehub-a76c5",
  storageBucket: "tradehub-a76c5.appspot.com",
  messagingSenderId: "241765347282",
  appId: "1:241765347282:web:4735550b8c38005d2b220b",
  measurementId: "G-JTSFBT7E46",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const database = getFirestore(app);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const usersRef = collection(database, "users");
export const itemsRef = collection(database, "items");
export const favouriteItemsRef = collection(database, "favourites");
export const exchangesRef = collection(database, "exchanges");
export const matchedUsersRef = collection(database, "matchedUsers");

export default app;
