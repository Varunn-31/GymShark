import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

 const readEnv = (key) => {
   const value = process.env ? process.env[key] : undefined;
   if (typeof value !== "string") return value;
   return value.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
 };

const firebaseConfig = {
  apiKey: readEnv("REACT_APP_FIREBASE_API_KEY"),
  authDomain: readEnv("REACT_APP_FIREBASE_AUTH_DOMAIN"),
  projectId: readEnv("REACT_APP_FIREBASE_PROJECT_ID"),
  storageBucket: readEnv("REACT_APP_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: readEnv("REACT_APP_FIREBASE_MESSAGING_SENDER_ID"),
  appId: readEnv("REACT_APP_FIREBASE_APP_ID"),
  measurementId: readEnv("REACT_APP_FIREBASE_MEASUREMENT_ID")
};

if (!firebaseConfig.apiKey) {
  const availableEnvKeys = process.env
    ? Object.keys(process.env).filter((k) => k.startsWith("REACT_APP_FIREBASE_"))
    : [];
  console.error(
    "Firebase API Key is missing. Please check your .env file and restart the server.",
    {
      nodeEnv: process.env ? process.env.NODE_ENV : undefined,
      availableEnvKeys,
    }
  );
  throw new Error("Firebase API Key is missing. Please check your .env file and restart the server.");
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
