// admin.js
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

// Liste des UID autorisés
const adminUIDs = [
  "2SiHTzC7CMLz21x42XeI",        // ✅ Premier administrateur
  "wOY1JtBng7WYAaQzkC4fm1nLmwe2" // ✅ Deuxième administrateur
];

// Authentification de l’administrateur
onAuthStateChanged(auth, user => {
  if (user && adminUIDs.includes(user.uid)) {
    console.log("Admin connecté :", user.email);
  } else {
    window.location.href = "connexion-admin.html"; // Redirection si non admin
  }
});

// Gestion du formulaire
const publicationForm = document.getElementById("publicationForm");
const descriptionInput = document.getElementById("description");
const imageInput = document.getElementById("image");

publicationForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const file = imageInput.files[0];
  const description = descriptionInput.value.trim();

  if (!file || !description) {
    alert("Veuillez ajouter une image et une description.");
    return;
  }

  const storageRef = ref(storage, `images/${Date.now()}-${file.name}`);
  await uploadBytes(storageRef, file);
  const imageUrl = await getDownloadURL(storageRef);

  const publicationRef = doc(collection(db, "publications"));
  await setDoc(publicationRef, {
    imageUrl,
    description,
    timestamp: serverTimestamp()
  });

  alert("✅ Publication ajoutée !");
  publicationForm.reset();
});

// Bouton de déconnexion
const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "connexion-admin.html";
});
