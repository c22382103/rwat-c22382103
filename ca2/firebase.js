import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
 addDoc,
  serverTimestamp,
  getDocs
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "...",
  authDomain: "rwat-c22382103.firebaseapp.com",
  projectId: "rwat-c22382103",
  storageBucket: "rwat-c22382103.firebasestorage.app",
  messagingSenderId: "692745446754",
  appId: "1:692745446754:web:4c2ddf9f001b61a317b83b",
  measurementId: "G-CH48G3T1S1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const resultsCollection = collection(db, "gameResults");

export async function saveGameResult(clicks) {
  await addDoc(resultsCollection, {
    clicks: clicks,
    createdAt: serverTimestamp()
  });
}

export async function getAverageClicks() {
  const snapshot = await getDocs(resultsCollection);
  if (snapshot.empty) return null;
  let total = 0;
  let count = 0;
  snapshot.forEach(doc => {
    const data = doc.data();
    if (typeof data.clicks === "number") {
      total += data.clicks;
      count++;
    }
  });
  return count === 0 ? null : total / count;
}
