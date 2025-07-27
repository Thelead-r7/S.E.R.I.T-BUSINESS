import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDPavrp_mfV0POiDF3V4ZOZ0SHZGwgTmGs",
  authDomain: "serit-societe.firebaseapp.com",
  projectId: "serit-societe",
  storageBucket: "serit-societe.appspot.com",
  messagingSenderId: "25581120285",
  appId: "1:25581120285:web:b8ee391fabf3d626480ff4"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ✅ Persistance de la session
setPersistence(auth, browserLocalPersistence);

export { auth, db, storage };
