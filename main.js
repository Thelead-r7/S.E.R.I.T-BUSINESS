// main.js

// Importer la config Firebase (assure-toi d’avoir firebase-config.js chargé avant)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Config Firebase (tu peux séparer ce bloc dans firebase-config.js si tu veux)
const firebaseConfig = {
  apiKey: "TA_CLE_API",
  authDomain: "TON_PROJET.firebaseapp.com",
  projectId: "TON_PROJET",
  storageBucket: "TON_PROJET.appspot.com",
  messagingSenderId: "ID_MESSAGERIE",
  appId: "ID_APPLICATION"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Récupération et affichage des publications dans la galerie
async function afficherGalerie() {
  const galerie = document.getElementById("galerie");
  if (!galerie) return;

  const querySnapshot = await getDocs(collection(db, "publications"));
  galerie.innerHTML = ""; // Vider la galerie

  querySnapshot.forEach((doc) => {
    const data = doc.data();

    const div = document.createElement("div");
    div.className = "photo";

    const img = document.createElement("img");
    img.src = data.imageURL;
    img.alt = data.titre || "Publication";

    const titre = document.createElement("h3");
    titre.textContent = data.titre;

    const contenu = document.createElement("p");
    contenu.textContent = data.contenu;

    div.appendChild(img);
    div.appendChild(titre);
    div.appendChild(contenu);

    galerie.appendChild(div);
  });
}

// Lancer après chargement du DOM
document.addEventListener("DOMContentLoaded", afficherGalerie);
