import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC6NEh44vlzaxZiV_1IvU0L8Jyx5_3a5yc",
  authDomain: "saylani-quiz-app-d818e.firebaseapp.com",
  projectId: "saylani-quiz-app-d818e",
  storageBucket: "saylani-quiz-app-d818e.firebasestorage.app",
  messagingSenderId: "190358209381",
  appId: "1:190358209381:web:a9f76b56bf74a2edb3d78c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };