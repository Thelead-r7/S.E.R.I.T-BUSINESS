// admin.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

// --- Config Firebase ---
// Remplace par ta config Firebase
const firebaseConfig = {
apiKey: "AIzaSyDPavrp_mfV0POiDF3V4ZOZ0SHZGwgTmGs",
  authDomain: "serit-societe.firebaseapp.com",
  projectId: "serit-societe",
  storageBucket: "serit-societe.firebasestorage.app",
  messagingSenderId: "25581120285",
  appId: "1:25581120285:web:b8ee391fabf3d626480ff4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// UIDs admin autorisés (remplace par les vrais)
const adminUIDs = ["39yahW5x6UeOLSpLzghM5CNu3k73", "WqnEiCNVQjeFHOMXDz7drbDcl2m1"];

// Éléments du DOM
const form = document.getElementById("form-pub");
const titreInput = document.getElementById("titre");
const texteInput = document.getElementById("texte");
const imageInput = document.getElementById("image");
const messageDiv = document.getElementById("message");
const publicationsContainer = document.getElementById("publications-container");
const logoutBtns = [document.getElementById("btn-logout"), document.getElementById("btn-logout-bottom")];

// Variable pour stocker l’utilisateur connecté
let currentUser = null;

// --- Vérifier auth et UID admin ---
onAuthStateChanged(auth, (user) => {
  if (user && adminUIDs.includes(user.uid)) {
    currentUser = user;
    console.log("Admin connecté :", user.email);
    // Charger les publications en temps réel
    chargerPublications();
  } else {
    alert("Accès réservé aux administrateurs.");
    window.location.href = "index.html";
  }
});

// --- Déconnexion ---
logoutBtns.forEach((btn) =>
  btn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "index.html";
  })
);

// --- Ajouter publication ---
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const titre = titreInput.value.trim();
  const texte = texteInput.value.trim();
  const fichierImage = imageInput.files[0];

  if (!titre || !texte) {
    afficherMessage("Veuillez remplir le titre et le contenu.", true);
    return;
  }

  try {
    afficherMessage("Publication en cours...");

    let imageURL = "";

    // Si image sélectionnée, upload dans Storage
    if (fichierImage) {
      const imageRef = ref(storage, `publications/${Date.now()}_${fichierImage.name}`);
      const snapshot = await uploadBytes(imageRef, fichierImage);
      imageURL = await getDownloadURL(snapshot.ref);
    }

    // Ajouter publication dans Firestore
    await addDoc(collection(db, "publications"), {
      titre,
      texte,
      imageURL,
      timestamp: serverTimestamp(),
      likes: 0,
      commentairesCount: 0,
      createdBy: currentUser.uid,
    });

    // Reset formulaire
    form.reset();
    afficherMessage("Publication ajoutée avec succès !", false);
  } catch (error) {
    console.error("Erreur ajout publication :", error);
    afficherMessage("Erreur lors de la publication : " + error.message, true);
  }
});

// --- Charger et afficher publications avec bouton supprimer ---
function chargerPublications() {
  const q = query(collection(db, "publications"), orderBy("timestamp", "desc"));

  onSnapshot(q, (snapshot) => {
    publicationsContainer.innerHTML = "";
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const id = docSnap.id;

      const datePub = data.timestamp?.toDate().toLocaleString() || "Date inconnue";

      publicationsContainer.innerHTML += `
        <div class="publication-item">
          <h4>${data.titre}</h4>
          <small>Publié le ${datePub}</small>
          <p>${data.texte.substring(0, 150)}${data.texte.length > 150 ? "..." : ""}</p>
          ${data.imageURL ? `<img src="${data.imageURL}" alt="Image publication" style="max-width:100%;border-radius:6px;margin-top:8px;" />` : ""}
          <br />
          <button class="btn-delete" data-id="${id}" data-image="${data.imageURL || ""}">Supprimer</button>
        </div>
      `;
    });

    // Ajouter écouteurs sur les boutons supprimer
    const btnsSupprimer = document.querySelectorAll(".btn-delete");
    btnsSupprimer.forEach((btn) =>
      btn.addEventListener("click", async (e) => {
        const pubId = btn.dataset.id;
        const imageUrl = btn.dataset.image;

        if (confirm("Voulez-vous vraiment supprimer cette publication ?")) {
          try {
            // Supprimer l’image dans Storage si existe
            if (imageUrl) {
              const imageRef = ref(storage, imageUrl);
              await deleteObject(imageRef);
            }

            // Supprimer le document Firestore
            await deleteDoc(doc(db, "publications", pubId));

            afficherMessage("Publication supprimée.", false);
          } catch (err) {
            console.error("Erreur suppression :", err);
            afficherMessage("Erreur lors de la suppression : " + err.message, true);
          }
        }
      })
    );
  });
}

// --- Affichage message ---
function afficherMessage(msg, erreur = false) {
  messageDiv.textContent = msg;
  messageDiv.style.color = erreur ? "#bb2f2f" : "#006699";
  setTimeout(() => {
    messageDiv.textContent = "";
  }, 5000);
}
