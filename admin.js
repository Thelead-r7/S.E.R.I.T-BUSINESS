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
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// L’UID ou email des admins autorisés (tu peux gérer par UID pour plus de sécurité)
const adminsAutorises = [
  "oI3w6FMBL3b6PvI7KRZkfzBQfqn1", // exemple UID
  "wOY1JtBng7WYAaQzkC4fm1nLmwe2"
];

// Gérer la persistance sur le navigateur
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Persistance activée : session locale");
  })
  .catch((error) => {
    console.error("Erreur persistance:", error);
  });

// Vérifier l’état de connexion
onAuthStateChanged(auth, user => {
  if (user && adminsAutorises.includes(user.uid)) {
    console.log("Admin connecté :", user.email);
    afficherFormulaire();  // ta fonction pour afficher le formulaire si caché
  } else {
    console.log("Aucun admin connecté.");
    // Rediriger vers page connexion ou afficher formulaire de login
    afficherFormulaireConnexion();
  }
});

// Fonction pour gérer la soumission du formulaire (publication)
const form = document.getElementById("publication-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const titre = document.getElementById("titre").value.trim();
  const description = document.getElementById("description").value.trim();
  const imageFile = document.getElementById("image").files[0];

  if (!titre || !description || !imageFile) {
    alert("Tous les champs sont obligatoires");
    return;
  }

  try {
    const imageRef = ref(storage, `publications/${Date.now()}-${imageFile.name}`);
    await uploadBytes(imageRef, imageFile);
    const imageUrl = await getDownloadURL(imageRef);

    const publicationRef = doc(collection(db, "publications"));
    await setDoc(publicationRef, {
      titre,
      description,
      imageUrl,
      timestamp: serverTimestamp()
    });

    alert("Publication ajoutée avec succès !");
    form.reset();
  } catch (error) {
    console.error("Erreur ajout publication:", error);
    alert("Erreur lors de l'ajout.");
  }
});

// Exemple minimal de fonctions pour afficher le formulaire ou formulaire login
function afficherFormulaire() {
  form.style.display = "block";
  // ici tu caches l’écran login si tu en as un
}
function afficherFormulaireConnexion() {
  form.style.display = "none";
  // ici afficher un formulaire de connexion (email + mot de passe)
}

// Pour la déconnexion, tu peux ajouter un bouton et un gestionnaire
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "connexion-admin.html"; // ou recharge la page
  });
                  }
