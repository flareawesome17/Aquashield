// firebase.ts
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAflWq-V38MJ735-liBVQr1wwtIkJu3Qdk",
  authDomain: "aquashield-e1f19.firebaseapp.com",
  projectId: "aquashield-e1f19",
  storageBucket: "aquashield-e1f19.appspot.com", // ✅ fixed typo here
  messagingSenderId: "19186676991",
  appId: "1:19186676991:web:afcd641de1e042f7b508ca",
  measurementId: "G-WV6C2W9ZQE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Optional: Only initialize analytics if supported (avoids issues in SSR)
let analytics: ReturnType<typeof getAnalytics> | null = null;
isSupported().then((yes) => {
  if (yes) analytics = getAnalytics(app);
});

export { app, auth, db, analytics };
