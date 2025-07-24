// publication.js
import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Sélectionne la div où afficher les publications
const publicationsContainer = document.getElementById("publications-container");

// Fonction pour afficher toutes les publications
async function afficherPublications() {
  const publicationsRef = collection(db, "publications");
  const q = query(publicationsRef, orderBy("date", "desc")); // trie par date

  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      publicationsContainer.innerHTML = "<p>Aucune publication pour le moment.</p>";
      return;
    }

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      // Création du bloc HTML de chaque publication
      const publicationHTML = `
        <div class="carte-publication">
          <h2>${data.titre || "Sans titre"}</h2>
          <p>${data.texte || "Pas de texte."}</p>
          ${data.imageURL ? `<img src="${data.imageURL}" alt="Image de la publication">` : ""}
          <p class="date-publication">Publié le : ${data.date?.toDate().toLocaleString() || "Date inconnue"}</p>
        </div>
      `;

      publicationsContainer.innerHTML += publicationHTML;
    });
  } catch (error) {
    console.error("Erreur lors de l'affichage des publications :", error);
    publicationsContainer.innerHTML = "<p>Une erreur est survenue lors du chargement.</p>";
  }
}

// Lancer l’affichage au chargement
window.addEventListener("DOMContentLoaded", afficherPublications);
