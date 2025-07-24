// ✅ admin.js sécurisé
import { auth, db, storage } from "./firebase-config.js";
import {
  doc, setDoc, serverTimestamp, collection
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import {
  onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ✅ UID unique de l’administrateur autorisé
const adminUID = "39yahW5x6UeOLSpLzghM5CNu3k73";

// ✅ PROTECTION d'accès à admin.html
onAuthStateChanged(auth, (user) => {
  if (!user || user.uid !== adminUID) {
    alert("Accès refusé. Vous allez être redirigé.");
    signOut(auth).then(() => {
      window.location.href = "connexion-admin.html";
    });
  }
});

// ✅ Déconnexion
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "connexion-admin.html";
  });
}

// ✅ Soumission du formulaire de publication
const form = document.getElementById("publicationForm");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titre = document.getElementById("titre").value.trim();
    const description = document.getElementById("description").value.trim();
    const image = document.getElementById("image").files[0];

    if (!titre || !description || !image) {
      alert("Tous les champs sont obligatoires.");
      return;
    }

    try {
      // ✅ Envoie de l’image dans Firebase Storage
      const imageRef = ref(storage, `publications/${Date.now()}-${image.name}`);
      const snapshot = await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(snapshot.ref);

      // ✅ Ajout dans Firestore
      await setDoc(doc(collection(db, "publications")), {
        titre,
        description,
        imageUrl,
        timestamp: serverTimestamp()
      });

      alert("✅ Publication enregistrée !");
      form.reset();

    } catch (error) {
      console.error("❌ Erreur de publication :", error);
      alert("Erreur pendant l'envoi. Vérifie ta connexion.");
    }
  });
        }
