// ✅ admin.js corrigé
import { auth, db, storage } from "./firebase-config.js";
import {
  doc,
  setDoc,
  serverTimestamp,
  collection
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// UID unique de l’administrateur autorisé
const adminUID = "39yahW5x6UeOLSpLzghM5CNu3k73";

// ✅ Vérification de l’authentification + autorisation
onAuthStateChanged(auth, user => {
  if (!user) {
    alert("Accès refusé. Veuillez vous connecter.");
    window.location.href = "connexion-admin.html";
  } else if (user.uid !== adminUID) {
    alert("Accès refusé : vous n'êtes pas autorisé.");
    signOut(auth);
    window.location.href = "connexion-admin.html";
  }
});

// ✅ Soumission du formulaire de publication
document.getElementById("publicationForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const titre = document.getElementById("titre").value.trim();
  const description = document.getElementById("description").value.trim();
  const image = document.getElementById("image").files[0];

  if (!titre || !description || !image) {
    alert("Tous les champs sont obligatoires.");
    return;
  }

  try {
    // ✅ Upload image vers Firebase Storage
    const imageRef = ref(storage, "publications/" + Date.now() + "-" + image.name);
    const snapshot = await uploadBytes(imageRef, image);
    const imageUrl = await getDownloadURL(snapshot.ref);

    // ✅ Sauvegarde dans Firestore
    await setDoc(doc(collection(db, "publications")), {
      titre,
      description,
      imageUrl,
      timestamp: serverTimestamp()
    });

    alert("Publication réussie !");
    document.getElementById("publicationForm").reset();

  } catch (error) {
    console.error("Erreur lors de la publication :", error);
    alert("Une erreur est survenue. Vérifiez votre connexion ou vos droits.");
  }
});
