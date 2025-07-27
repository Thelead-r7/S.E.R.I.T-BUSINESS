import { auth, db, storage } from "./firebase-config.js";
import {
  doc, setDoc, serverTimestamp, collection
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ✅ UID autorisés
const allowedUIDs = [
  "39yahW5x6UeOLSpLzghM5CNu3k73",
  "WqnEiCNVQjeFHOMXDz7drbDcl2m1",
  "J011aHXXS6AOEzkw8WAB"
];

const form = document.getElementById("publicationForm");
const message = document.getElementById("message");

onAuthStateChanged(auth, user => {
  if (user && allowedUIDs.includes(user.uid)) {
    form.addEventListener("submit", async e => {
      e.preventDefault();

      const titre = form.titre.value;
      const contenu = form.contenu.value;
      const file = form.image.files[0];
      let imageURL = "";

      try {
        if (file) {
          const storageRef = ref(storage, 'images/' + file.name);
          await uploadBytes(storageRef, file);
          imageURL = await getDownloadURL(storageRef);
        }

        const docRef = doc(collection(db, "publications"));
        await setDoc(docRef, {
          titre,
          contenu,
          imageURL,
          date: serverTimestamp()
        });

        message.textContent = "✅ Publication ajoutée avec succès !";
        form.reset();
      } catch (error) {
        message.textContent = "❌ Erreur : " + error.message;
      }
    });
  } else {
    alert("Accès refusé.");
    window.location.href = "index.html";
  }
});
