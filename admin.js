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
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Référence au formulaire
const form = document.getElementById("publication-form");

onAuthStateChanged(auth, async (user) => {
  if (!user || user.uid !== "oI3w6FMBL3b6PvI7KRZkfzBQfqn1") {
    alert("Accès refusé");
    window.location.href = "connexion-admin.html";
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const titreInput = document.getElementById("titre");
  const imageInput = document.getElementById("image");
  const descriptionInput = document.getElementById("description");

  const titre = titreInput.value.trim();
  const description = descriptionInput.value.trim();
  const imageFile = imageInput.files[0];

  if (!titre || !description || !imageFile) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  try {
    const imageRef = ref(storage, "publications/" + imageFile.name);
    await uploadBytes(imageRef, imageFile);
    const imageUrl = await getDownloadURL(imageRef);

    const publicationRef = doc(collection(db, "publications"));
    await setDoc(publicationRef, {
      titre, // <-- champ ajouté
      imageUrl,
      description,
      timestamp: serverTimestamp()
    });

    alert("Publication ajoutée avec succès !");
    form.reset();
  } catch (error) {
    console.error("Erreur lors de la publication :", error);
    alert("Une erreur est survenue.");
  }
});
